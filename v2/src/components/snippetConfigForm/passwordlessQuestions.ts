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
          sendCB_Node: "createAndSendCustomTextMessage: async (input, context) => { /* See next step */ },",
          sendCB_Go:
            `ContactMethodPhone: plessmodels.ContactMethodPhoneConfig{
    Enabled: true,
    CreateAndSendCustomTextMessage: func(phoneNumber string, userInputCode, urlWithLinkCode *string, codeLifetime uint64, preAuthSessionId string, userContext supertokens.UserContext) error {
        /* See next step */
        return nil
    },
},`,
          sendCB_Python_def:
            "\nasync def send_text_message (param: CreateAndSendCustomTextMessageParameters):\n    # See next step\n",
          sendCB_Python: "create_and_send_custom_text_message=send_text_message",
          initialize_Python: "ContactPhoneOnlyConfig",
          import_Python: "from supertokens_python.recipe.passwordless import ContactPhoneOnlyConfig, CreateAndSendCustomTextMessageParameters"
        },
      },
      {
        title: "Only email",
        activeText: "Your users will log in using an email.",
        value: "EMAIL",
        variableMap: {
          sendCB_Node: "createAndSendCustomEmail: async (input, context) => { /* See next step */ },",
          sendCB_Go:
            `ContactMethodEmail: plessmodels.ContactMethodEmailConfig{
    Enabled: true,
    CreateAndSendCustomEmail: func(email string, userInputCode, urlWithLinkCode *string, codeLifetime uint64, preAuthSessionId string, userContext supertokens.UserContext) error {
        /* See next step */
        return nil
    },
},`,
          sendCB_Python_def:
            "\nasync def send_email (params: CreateAndSendCustomEmailParameters):\n    # See next step\n",
          sendCB_Python: "create_and_send_custom_email=send_email",
          initialize_Python: "ContactEmailOnlyConfig",
          import_Python: "from supertokens_python.recipe.passwordless import ContactEmailOnlyConfig, CreateAndSendCustomEmailParameters"
        },
      },
      {
        title: "Email or phone number",
        activeText: "Your users will log in using an email or a phone number.",
        variableMap: {
          sendCB_Node:
            "createAndSendCustomEmail: async (input, context) => { /* See next step */ },\ncreateAndSendCustomTextMessage: async (input, context) => { /* See next step */ },",
          sendCB_Go:
            `ContactMethodEmailOrPhone: plessmodels.ContactMethodEmailOrPhoneConfig{
    Enabled: true,
    CreateAndSendCustomEmail: func(email string, userInputCode, urlWithLinkCode *string, codeLifetime uint64, preAuthSessionId string, userContext supertokens.UserContext) error {
      /* See next step */
      return nil
    },
    CreateAndSendCustomTextMessage: func(phoneNumber string, userInputCode, urlWithLinkCode *string, codeLifetime uint64, preAuthSessionId string, userContext supertokens.UserContext) error {
      /* See next step */
      return nil
    },
},`,
          sendCB_Python_def:
            "\nasync def send_text_message (param: CreateAndSendCustomTextMessageParameters):\n    # See next step\n" +
            "\nasync def send_email (params: CreateAndSendCustomEmailParameters):\n    # See next step\n",
          sendCB_Python:
            "create_and_send_custom_text_message=send_text_message,\ncreate_and_send_custom_email=send_email",
          initialize_Python: "ContactEmailOrPhoneConfig",
          import_Python: "from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig, CreateAndSendCustomEmailParameters, CreateAndSendCustomEmailParameters"
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
