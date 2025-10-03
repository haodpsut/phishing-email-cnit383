
import { Email } from './types';

export const EMAIL_SCENARIOS: Email[] = [
  // --- Existing Phishing Emails ---
  {
    id: 'phish-01',
    type: 'phishing',
    sender_name: 'IT Support',
    sender_email: 'support@microsft-security.com',
    subject: 'Urgent: Security Alert on Your Account',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Dear User,</p>
        <p>We have detected suspicious activity on your account. To protect your information, your account has been temporarily suspended.</p>
        <p>To restore access, you must verify your identity immediately. Please click the link below to reset your password.</p>
        <p><a href="http://bit.ly/secure-reset-xyz123" style="color: #007bff;">Reset Password Now</a></p>
        <p>If you do not take action within 24 hours, your account will be permanently deleted.</p>
        <p>Thank you,<br/>The Security Team</p>
      </div>
    `,
    analysis_key: {
      sender_discrepancy: "The sender's email domain 'microsft-security.com' is a common misspelling of 'microsoft.com', a classic red flag.",
      link_destination: "The 'Reset Password' link points to a suspicious, shortened URL ('http://bit.ly/xyz123'), not an official company domain.",
      urgency_and_fear: "The email creates a false sense of urgency and fear by threatening account deletion within 24 hours to provoke a hasty reaction.",
      generic_greeting: "The greeting 'Dear User' is impersonal. Legitimate companies usually address you by your name."
    },
  },
  {
    id: 'phish-02',
    type: 'phishing',
    sender_name: 'Mega Lottery Prize',
    sender_email: 'winner-notification@claim-your-prize-now.net',
    subject: 'CONGRATULATIONS! You Have Won $1,500,000!',
    body: `
      <div style="font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 16px; color: #000; background-color: #ffff99; padding: 20px;">
        <h1 style="color: #ff0000;">YOU ARE A WINNER!!!</h1>
        <p>Congratulations!! Your email address was selected as a winner in our international lottery promotion.</p>
        <p>You have won the grand prize of <strong>$1,500,000.00 USD</strong>!</p>
        <p>To claim your prize, you must contact our claims agent, Mr. John Smith, and provide your personal details for verification. You must also pay a small processing fee of $250 to release the funds.</p>
        <p>Reply to this email with your Full Name, Address, and Phone Number to begin the process.</p>
        <p style="font-weight: bold; text-decoration: underline;">THIS IS A LIMITED TIME OFFER. ACT NOW!</p>
      </div>
    `,
    analysis_key: {
      too_good_to_be_true: "The offer of a $1.5 million lottery prize that you didn't enter is a classic 'too good to be true' scam.",
      request_for_fee: "Legitimate lotteries never ask winners to pay a fee to receive their prize. This is an advance-fee fraud tactic.",
      request_for_personal_info: "Asking for personal information via email reply is insecure and a common tactic for identity theft.",
      unprofessional_design: "The use of 'Comic Sans MS', bright colors, and excessive capitalization is highly unprofessional and typical of scam emails."
    },
  },
  // --- Existing Legitimate Email ---
  {
    id: 'legit-01',
    type: 'legitimate',
    sender_name: 'Innovate Corp Newsletter',
    sender_email: 'newsletter@innovatecorp.com',
    subject: 'Your Weekly Digest: AI, Tech, and Future Trends',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <h2 style="color: #2c3e50;">Innovate Corp Weekly</h2>
        <p>Hi there,</p>
        <p>Welcome to your weekly roundup of the most exciting news in technology and innovation. This week, we're diving into the latest advancements in generative AI and what they mean for the future of work.</p>
        <p>Read the full articles on our official blog:</p>
        <p><a href="https://innovatecorp.com/blog" style="color: #007bff;">Visit the Innovate Corp Blog</a></p>
        <hr/>
        <p style="font-size: 12px; color: #777;">You are receiving this email because you subscribed to our newsletter. You can <a href="https://innovatecorp.com/unsubscribe">unsubscribe</a> at any time.</p>
      </div>
    `,
    analysis_key: {
      legitimate_domain: "The sender's email and all links point to the consistent and legitimate domain 'innovatecorp.com'.",
      no_urgency_or_threats: "The tone is informational and does not use high-pressure tactics, threats, or create a false sense of urgency.",
      professional_tone_and_format: "The email is well-written, professionally formatted, and contains expected elements like an unsubscribe link.",
      purpose_of_email: "The purpose is clear: a newsletter you likely subscribed to. It's not asking for sensitive information or unexpected actions."
    },
  },
  // --- New Scenarios ---
  {
    id: 'phish-03',
    type: 'phishing',
    sender_name: 'DHL Express',
    sender_email: 'shipping-update@dhl-tracking-service.com',
    subject: 'Action Required: Your Parcel is On Hold',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Dear Customer,</p>
        <p>Your parcel with tracking number <strong>734820411</strong> is currently on hold at our distribution center due to an unpaid customs fee of $2.99.</p>
        <p>To have your parcel delivered, please pay the outstanding fee through our secure portal.</p>
        <p><a href="http://dhl-portal.web.app/pay" style="color: #007bff;">Pay Customs Fee</a></p>
        <p>Failure to pay within 48 hours will result in the parcel being returned to the sender.</p>
        <p>Sincerely,<br/>DHL Express</p>
      </div>
    `,
    analysis_key: {
      illegitimate_domain: "The sender's domain 'dhl-tracking-service.com' is not the official DHL domain (which is usually dhl.com).",
      suspicious_link: "The link for payment points to 'dhl-portal.web.app', which is not a legitimate DHL website. It's a common tactic to use subdomains of hosting services.",
      small_fee_tactic: "Requesting a small, seemingly insignificant fee is a common tactic to trick users into entering their payment information on a fraudulent site.",
      urgency: "A 48-hour deadline is used to pressure the recipient into acting without thinking."
    }
  },
  {
    id: 'phish-04',
    type: 'phishing',
    sender_name: 'Jane Doe (CEO)',
    sender_email: 'ceo.jane.doe@gmail.com',
    subject: 'Urgent & Confidential Request',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hi,</p>
        <p>I'm in a conference right now and need your help with something urgent. I need to get some gift cards for a client, but I can't do it myself. Can you purchase three $100 Apple Gift Cards and send me the codes? I will reimburse you as soon as I'm out.</p>
        <p>This is very important and time-sensitive.</p>
        <p>Let me know if you can handle this.</p>
        <p>Thanks,<br/>Jane</p>
      </div>
    `,
    analysis_key: {
      unusual_request: "A CEO asking an employee to buy gift cards is a highly unusual and unprofessional request, which is a major red flag for a scam.",
      from_personal_email: "The email is from a generic Gmail address, not the official company email address of the CEO.",
      sense_of_urgency: "The message stresses urgency and confidentiality to prevent the recipient from verifying the request through other channels.",
      impersonation: "This is a classic example of CEO fraud or Business Email Compromise (BEC), where an attacker impersonates a high-level executive."
    }
  },
  {
    id: 'phish-05',
    type: 'phishing',
    sender_name: 'Netflix',
    sender_email: 'support@netflx-billing.com',
    subject: 'Your Subscription is On Hold!',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hi Customer,</p>
        <p>We were unable to process your last payment. Your subscription is now on hold.</p>
        <p>To keep enjoying your favorite shows, please update your payment details.</p>
        <p><a href="http://netflx-billing-update.com/login" style="color: #e50914; text-decoration: none; font-weight: bold;">UPDATE PAYMENT INFO</a></p>
        <p>We're here to help if you need it.</p>
        <p>— The Netflix Team</p>
      </div>
    `,
    analysis_key: {
      misspelled_domain: "The sender email uses 'netflx-billing.com', a misspelling of the official 'netflix.com' domain.",
      generic_greeting: "The email starts with 'Hi Customer' instead of the user's actual name.",
      fake_link: "The link to update payment info leads to a non-Netflix domain designed to steal credentials and credit card information.",
      fear_tactic: "The threat of suspending the service is designed to make the user act quickly without scrutinizing the email."
    }
  },
   {
    id: 'phish-06',
    type: 'phishing',
    sender_name: 'QuickBooks',
    sender_email: 'invoice-noreply@intuit-quickbooks.org',
    subject: 'Invoice #8331 from Synergy Corp',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Dear Client,</p>
        <p>You have received a new invoice from Synergy Corp for $1,280.50.</p>
        <p>Please review and pay the attached invoice at your earliest convenience. The payment is due within 7 days.</p>
        <p><strong>Download Invoice:</strong> <a href="http://storage.cloud-hosting-provider.com/invoice_8331.zip" style="color: #007bff;">invoice_8331.zip</a></p>
        <p>If you have any questions, please contact Synergy Corp directly.</p>
        <p>Thank you,<br/>QuickBooks Invoicing</p>
      </div>
    `,
    analysis_key: {
      unsolicited_attachment: "The email contains a link to download a .zip file, which is a common way to deliver malware.",
      suspicious_sender_domain: "The sender domain 'intuit-quickbooks.org' is not the official domain for Intuit QuickBooks.",
      unexpected_invoice: "Receiving an unexpected invoice from an unknown company ('Synergy Corp') is a common phishing lure.",
      generic_greeting: "The email uses a generic greeting 'Dear Client' instead of a specific name or business name."
    }
  },
  {
    id: 'legit-02',
    type: 'legitimate',
    sender_name: 'Amazon.com',
    sender_email: 'order-update@amazon.com',
    subject: 'Your Amazon.com order of "The Pragmatic Programmer" has shipped!',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <h2 style="color: #FF9900;">Your Order Has Shipped!</h2>
        <p>Hello Jane Doe,</p>
        <p>We're happy to let you know that your order has shipped. You can track your package here:</p>
        <p><a href="https://www.amazon.com/gp/your-account/order-details" style="display: inline-block; background-color: #FF9900; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Your Package</a></p>
        <p><strong>Estimated Delivery:</strong> October 26, 2024</p>
        <p>We hope you enjoy your purchase!</p>
      </div>
    `,
    analysis_key: {
      legitimate_sender: "The email comes from the official 'amazon.com' domain.",
      personalized_content: "The email includes the customer's name and the specific item ordered, which is typical for legitimate transaction emails.",
      correct_links: "The link to track the package points to the official Amazon website domain.",
      no_urgent_demands: "The email is purely informational and does not demand any urgent action, passwords, or payments."
    }
  },
  {
    id: 'legit-03',
    type: 'legitimate',
    sender_name: 'Google',
    sender_email: 'no-reply@accounts.google.com',
    subject: 'Security alert: New sign-in to your Google Account',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hi John,</p>
        <p>Your Google Account was just signed into from a new Windows device. You're getting this email to make sure it was you.</p>
        <p><strong>Device:</strong> Windows PC<br/><strong>Location:</strong> San Francisco, CA, USA (Approximate)</p>
        <p>If this was you, you can ignore this email. If you don't recognize this activity, please secure your account immediately.</p>
        <p><a href="https://myaccount.google.com/security" style="color: #007bff;">Check activity</a></p>
        <p>Thanks,<br/>The Google Accounts team</p>
      </div>
    `,
    analysis_key: {
      official_sender: "The email is from 'no-reply@accounts.google.com', which is a legitimate Google domain.",
      legitimate_links: "The 'Check activity' link directs to the official 'myaccount.google.com' security page.",
      provides_information: "The email provides specific details about the sign-in event without asking for credentials directly in the email.",
      safe_call_to_action: "The call to action is to review activity on a secure, official website, which is a standard security practice."
    }
  },
  {
    id: 'legit-04',
    type: 'legitimate',
    sender_name: 'DocuSign',
    sender_email: 'dse@docusign.net',
    subject: 'Completed: Please DocuSign this document: Offer Letter.pdf',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p><strong>John Smith sent you a document to review and sign.</strong></p>
        <p>Please review and sign this document by the end of the day.</p>
        <p><a href="https://www.docusign.net/...." style="display: inline-block; background-color: #FFC107; color: #000; padding: 15px; text-decoration: none; border-radius: 5px; font-weight: bold;">REVIEW DOCUMENT</a></p>
        <p>This document is a legally binding agreement. Please review it carefully.</p>
        <p>Thank you,</p>
        <p>Sent via DocuSign</p>
      </div>
    `,
    analysis_key: {
      correct_domain: "The sender 'dse@docusign.net' is the official domain used by DocuSign for email envelopes.",
      expected_action: "If the recipient is expecting a contract or document to sign (e.g., during a job application process), this email is expected.",
      legitimate_link: "The link points to the official DocuSign domain, which is the correct platform for this action.",
      professional_template: "The email uses a standard, professional template consistent with DocuSign's branding."
    }
  },
  {
    id: 'legit-05',
    type: 'legitimate',
    sender_name: 'GitHub',
    sender_email: 'noreply@github.com',
    subject: '[GitHub] A personal access token has been added to your account',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hey @CoolCoder24,</p>
        <p>A new personal access token (classic) with the "repo" scope was recently added to your account.</p>
        <p>If you did not create this token, please visit <a href="https://github.com/settings/tokens" style="color: #007bff;">your settings</a> and delete the token immediately. Also, consider changing your password.</p>
        <p>To see this and other security events, visit your security log: <a href="https://github.com/settings/security-log" style="color: #007bff;">https://github.com/settings/security-log</a></p>
        <p>Thanks,<br/>The GitHub Team</p>
      </div>
    `,
    analysis_key: {
      official_sender_domain: "The email comes from 'noreply@github.com', the official email address for GitHub notifications.",
      includes_username: "The email correctly includes the user's GitHub handle ('@CoolCoder24'), making it personalized and credible.",
      links_to_correct_domain: "All links in the email point to the legitimate 'github.com' domain.",
      no_direct_credential_request: "The email advises the user to visit their settings but does not ask them to enter their password directly from the email."
    }
  },
  {
    id: 'phish-07',
    type: 'phishing',
    sender_name: 'Dropbox',
    sender_email: 'no-reply@dropbox-mail.com',
    subject: 'Your Dropbox is almost full!',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hi,</p>
        <p>Your Dropbox is 98% full. Upgrade now to get more space and ensure your files are not deleted.</p>
        <p>For a limited time, get 2TB of space for 50% off!</p>
        <p><a href="http://dropbox-upgrade.info/plus" style="display: inline-block; background-color: #007EE5; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Upgrade Now</a></p>
        <p>Don't lose your important files!</p>
        <p>The Dropbox Team</p>
      </div>
    `,
    analysis_key: {
      suspicious_domain: "The sender's domain 'dropbox-mail.com' is not the official Dropbox domain. The link 'dropbox-upgrade.info' is also not official.",
      fear_of_loss: "The email creates a sense of fear by threatening that files might be deleted if the user doesn't act.",
      impersonal_greeting: "It uses a generic 'Hi,' instead of the user's name.",
      unsolicited_offer: "While Dropbox does offer upgrades, this email combines a warning with a high-pressure 'limited time' offer to rush the user."
    }
  },
  {
    id: 'phish-08',
    type: 'phishing',
    sender_name: 'LinkedIn',
    sender_email: 'messaging-noreply@linkedin-corp.com',
    subject: 'You appeared in 9 searches this week',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hi,</p>
        <p>See who's been looking at your profile. Your profile has been getting a lot of attention lately!</p>
        <p><a href="http://linkedin.profile-viewer.net/login" style="color: #007bff;">See who's viewed your profile</a></p>
        <p>This is a great opportunity to network. Don't miss out.</p>
        <p>The LinkedIn Team</p>
      </div>
    `,
    analysis_key: {
      curiosity_lure: "The email plays on curiosity, a common social engineering tactic, to entice users to click.",
      fake_domain: "The sender domain 'linkedin-corp.com' and the link domain 'profile-viewer.net' are not the real LinkedIn.com domain.",
      impersonal: "The email is not personalized with the user's name, which is unusual for a legitimate LinkedIn notification.",
      no_specifics: "Legitimate LinkedIn emails of this type usually provide some anonymous details (e.g., 'a recruiter from Acme Corp'). This one is vague."
    }
  },
    {
    id: 'phish-09',
    type: 'phishing',
    sender_name: 'Account Security',
    sender_email: 'secure@update-login-required.com',
    subject: 'Action Required: Unusual Sign-in Activity Detected',
    body: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>We detected an unusual sign-in attempt to your account from a new location (Moscow, Russia).</p>
        <p>If this was not you, please secure your account immediately by verifying your login details.</p>
        <p><a href="http://update-login-required.com/verify" style="color: #007bff;">Verify Your Account</a></p>
        <p>For your security, access has been temporarily limited until you verify your account.</p>
        <p>Thank you.</p>
      </div>
    `,
    analysis_key: {
      vague_and_generic: "The email does not mention which account it is for (e.g., Google, Apple, etc.), which is a major red flag.",
      suspicious_sender_and_link: "The sender domain and link domain 'update-login-required.com' are generic and not associated with any legitimate service.",
      fear_and_urgency: "It uses a scary location (Moscow, Russia) and threatens account limitation to provoke an immediate, fearful reaction.",
      direct_login_request: "The email directly prompts the user to enter their login details on a suspicious page."
    }
  },
];
