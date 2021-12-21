export const passwordlessQuestions = {
  contactMethod: {
    id: "contactMethod",
    title: "How do you want to identify your users?",
    options: [
      { title: "Phone number", value: "PHONE" },
      { title: "Email", value: "EMAIL" },
    ],
  },
  flowType: {
    id: "flowType",
    title: "Which authentication type will you use?",
    options: [
      { title: "OTP", value: "USER_INPUT_CODE" },
      { title: "Magic links", value: "MAGIC_LINK" },
      { title: "OTP and Magic link", value: "USER_INPUT_CODE_AND_MAGIC_LINK" },
    ],
  },
};
