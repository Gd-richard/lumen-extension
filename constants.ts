import { AnalysisResult, FaqItem } from './types';

export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  dataUsage: "They collect your email, browsing history, IP address, and device location to create a user profile.",
  permissions: "Requires access to cookies for tracking, local storage, and optional camera access for profile photos.",
  risks: "Your data is shared with third-party advertising networks. No clear encryption standard mentioned for stored messages.",
  rights: "You have the right to request a copy of your data and request deletion (GDPR/CCPA compliant)."
};

export const MOCK_FAQS: FaqItem[] = [
  {
    question: "Do they sell my data?",
    answer: "Technically no, but they 'share' it with partners who may use it for targeted advertising, which feels similar."
  },
  {
    question: "Can I delete my data?",
    answer: "Yes. You can email privacy@example.com to request full account deletion, which takes up to 30 days."
  },
  {
    question: "What's the biggest risk?",
    answer: "The vague 'partner sharing' clause allows them to transfer your profile to undefined third parties without explicit consent."
  }
];