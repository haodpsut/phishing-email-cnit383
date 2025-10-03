import { GoogleGenAI, Type } from '@google/genai';
import { Analysis, Email, Feedback, ApiSettings, ApiProvider } from '../types';

// Gemini-specific schema using the SDK's Type enum
const feedbackGeminiSchema = {
  type: Type.OBJECT,
  properties: {
    whatYouGotRight: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of points the student correctly identified in their analysis. Be encouraging."
    },
    whatYouMissed: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of phishing indicators from the analysis_key that the student did not mention."
    },
    expertAnalysis: {
      type: Type.STRING,
      description: "A detailed, step-by-step breakdown of all the indicators in the email, explaining why each is a red flag. Use Markdown for formatting."
    },
    keyTakeaways: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 bullet points summarizing the most important lessons from this specific simulation."
    }
  },
  required: ['whatYouGotRight', 'whatYouMissed', 'expertAnalysis', 'keyTakeaways']
};

// Standard JSON schema for other providers (e.g., Claude Tool Use)
const feedbackJsonSchema = {
  type: 'object',
  properties: {
    whatYouGotRight: {
      type: 'array',
      items: { type: 'string' },
      description: "A list of points the student correctly identified in their analysis. Be encouraging."
    },
    whatYouMissed: {
      type: 'array',
      items: { type: 'string' },
      description: "A list of phishing indicators from the analysis_key that the student did not mention."
    },
    expertAnalysis: {
      type: 'string',
      description: "A detailed, step-by-step breakdown of all the indicators in the email, explaining why each is a red flag. Use Markdown for formatting."
    },
    keyTakeaways: {
      type: 'array',
      items: { type: 'string' },
      description: "2-3 bullet points summarizing the most important lessons from this specific simulation."
    }
  },
  required: ['whatYouGotRight', 'whatYouMissed', 'expertAnalysis', 'keyTakeaways']
};


const createPrompt = (studentAnalysis: Analysis, email: Email): { system: string, user: string } => {
  const system_prompt = `You are 'CyBot', a helpful and clear cybersecurity instructor. Your tone should be encouraging but precise. Your task is to analyze a student's evaluation of a simulated email and provide structured feedback. Compare the student's analysis with the 'Correct Analysis Points'.
- Identify what the student correctly spotted.
- Identify what key points from the 'analysis_key' the student missed.
- Generate a comprehensive 'Expert Analysis' based ONLY on the provided 'analysis_key'.
- Formulate 2-3 key takeaways.
- Return your feedback in the specified JSON format. If the student's analysis is brief, infer their reasoning and still provide a full feedback structure. For "What you got right", if the student correctly identified the email as phishing, mention that first.`;
  
  const user_prompt = `
    Here is the original email data and the correct analysis (the ground truth):
    - Email Type: ${email.type}
    - Sender: ${email.sender_name} <${email.sender_email}>
    - Subject: ${email.subject}
    - Correct Analysis Points (analysis_key): ${JSON.stringify(email.analysis_key, null, 2)}

    Here is the student's submission:
    - Student's Verdict: ${studentAnalysis.verdict}
    - Sender Analysis: "${studentAnalysis.senderAnalysis}"
    - Subject Line Analysis: "${studentAnalysis.subjectAnalysis}"
    - Links & Attachments Analysis: "${studentAnalysis.linksAnalysis}"
    - Grammar & Tone Analysis: "${studentAnalysis.grammarAnalysis}"
    - Overall Reasoning: "${studentAnalysis.overallReasoning}"
  `;

  return { system: system_prompt, user: user_prompt };
}

const API_ENDPOINTS: Record<Exclude<ApiProvider, 'gemini'>, string> = {
    openai: 'https://api.openai.com/v1/chat/completions',
    openrouter: 'https://openrouter.ai/api/v1/chat/completions',
    claude: 'https://api.anthropic.com/v1/messages',
    xai: 'https://api.xai.com/v1/chat/completions',
};

const validateFeedback = (data: any): Feedback => {
    if (
      !data ||
      !Array.isArray(data.whatYouGotRight) ||
      !Array.isArray(data.whatYouMissed) ||
      typeof data.expertAnalysis !== 'string' ||
      !Array.isArray(data.keyTakeaways)
    ) {
      throw new Error("AI response is missing required fields or has the wrong format.");
    }
    return data as Feedback;
}


export const generateFeedback = async (studentAnalysis: Analysis, email: Email, settings: ApiSettings): Promise<Feedback> => {
    const { provider, apiKey, modelName } = settings;
    if (!apiKey) {
        throw new Error("API Key is missing.");
    }
    if (!modelName) {
        throw new Error("Model Name is missing.");
    }

    const { system, user } = createPrompt(studentAnalysis, email);

    try {
        let feedbackData: any;

        if (provider === 'gemini') {
            // NOTE: The @google/genai package is used for Gemini.
            // It is assumed that process.env.API_KEY is NOT set, and we use the user-provided key.
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: modelName,
                contents: `${system}\n\n${user}`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: feedbackGeminiSchema,
                    temperature: 0.3,
                },
            });
            feedbackData = JSON.parse(response.text.trim());
        } else if (provider === 'claude') {
            const response = await fetch(API_ENDPOINTS.claude, {
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    model: modelName,
                    system: system,
                    messages: [{ role: 'user', content: user }],
                    max_tokens: 2048,
                    temperature: 0.3,
                    tool_choice: { type: 'tool', name: 'submit_feedback' },
                    tools: [{
                        name: 'submit_feedback',
                        description: 'Submits the structured feedback for the user analysis.',
                        input_schema: feedbackJsonSchema,
                    }]
                }),
            });
            if (!response.ok) {
                 const errorBody = await response.text();
                 throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            const responseData = await response.json();
            const toolCall = responseData.content.find((block: any) => block.type === 'tool_use');
            if (!toolCall || !toolCall.input) throw new Error("Claude response did not include the required tool call output.");
            feedbackData = toolCall.input;
        } else {
            // OpenAI and other compatible APIs (Openrouter, xAI)
            const endpoint = API_ENDPOINTS[provider];
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: modelName,
                    messages: [
                        { role: 'system', content: `${system}\n\nYou must respond in a JSON object adhering to this schema: ${JSON.stringify(feedbackJsonSchema)}` },
                        { role: 'user', content: user },
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.3,
                }),
            });
            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`${provider} API error: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            const responseData = await response.json();
            if (!responseData.choices || !responseData.choices[0].message.content) {
                throw new Error("Invalid response structure from API.");
            }
            feedbackData = JSON.parse(responseData.choices[0].message.content);
        }

        return validateFeedback(feedbackData);

    } catch (error: any) {
        console.error(`Error generating feedback from ${provider} API:`, error);
        throw new Error(`Failed to get feedback from CyBot via ${provider}. Check your API Key, Model Name, and network connection. (${error.message})`);
    }
};
