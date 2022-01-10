export const passwordlessQuestions = {
  contactMethod: {
    id: "contactMethod",
    title: "How do you want to identify your users?",
    options: [
      { title: "Phone number", activeText: "Your users will log in using a phone number.", value: "PHONE" },
      { title: "Email", activeText: "Your users will log in using an email.", value: "EMAIL" },
      { title: "Email or Phone number", activeText: "Your users will log in using an email or a phone number.", value: "EMAIL_OR_PHONE" },
    ],
  },
  flowType: {
    id: "flowType",
    title: "Which authentication type will you use?",
    options: [
      { title: "OTP", activeText: "Your users will authenticate by typing in an OTP.", value: "USER_INPUT_CODE" },
      { title: "Magic links", activeText: "Your users will authenticate by clicking a magic link.", value: "MAGIC_LINK" },
      { title: "OTP and Magic link", activeText: "Your users will authenticate by typing an OTP or clicking a magic link.", value: "USER_INPUT_CODE_AND_MAGIC_LINK" },
    ],
  },
};
