import { QuestionInfo } from ".";

export const passwordlessQuestions: Record<string, QuestionInfo<any>> = {
  contactMethod: {
    id: "contactMethod",
    title: "How do you want to identify your users?",
    options: [
      {
        title: "Only phone number",
        activeText: "Your users will log in using a phone number.",
        value: "PHONE",
        variableMap: {
          sendCB_Go:
            `ContactMethodPhone: plessmodels.ContactMethodPhoneConfig{
    Enabled: true,
},`,
          initialize_Python: "ContactPhoneOnlyConfig",
          import_Python: "from supertokens_python.recipe.passwordless import ContactPhoneOnlyConfig"
        },
      },
      {
        title: "Only email",
        activeText: "Your users will log in using an email.",
        value: "EMAIL",
        variableMap: {
          sendCB_Go:
            `ContactMethodEmail: plessmodels.ContactMethodEmailConfig{
    Enabled: true,
},`,
          initialize_Python: "ContactEmailOnlyConfig",
          import_Python: "from supertokens_python.recipe.passwordless import ContactEmailOnlyConfig"
        },
      },
      {
        title: "Email or phone number",
        activeText: "Your users will log in using an email or a phone number.",
        variableMap: {
          sendCB_Go:
            `ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
    Enabled: true,
},`,
          initialize_Python: "ContactEmailOrPhoneConfig",
          import_Python: "from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig"
        },
        value: "EMAIL_OR_PHONE",
      },
    ],
  },
  flowType: {
    id: "flowType",
    title: "Which authentication type will you use?",
    options: [
      { title: "OTP", activeText: "Your users will authenticate by typing in an OTP.", value: "USER_INPUT_CODE" },
      {
        title: "Magic links",
        activeText: "Your users will authenticate by clicking a magic link.",
        value: "MAGIC_LINK",
      },
      {
        title: "OTP and Magic link",
        activeText: "Your users will authenticate by typing an OTP or clicking a magic link.",
        value: "USER_INPUT_CODE_AND_MAGIC_LINK",
      },
    ],
  },
};
