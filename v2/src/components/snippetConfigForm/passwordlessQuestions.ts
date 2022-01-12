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
          sendCB_Node: "createAndSendCustomTextMessage: (input, context) => { /* See next step */ },",
          sendCB_Go:
            "CreateAndSendCustomTextMessage: func(phoneNumber string, userInputCode *string, urlWithLinkCode *string, codeLifetime uint64, preAuthSessionId string, userContext supertokens.UserContext) { /* See next step */ },",
          sendCB_Python_def:
            "\nasync def send_text_message (phoneNumber: str, userInputCode: Union[str, None], urlWithLinkCode: Union[str, None], codeLifetime: int, preAuthSessionId: str, userContext: Union[dict, None]):\n    # See next step\n",
          sendCB_Python: "create_and_send_custom_text_message=send_text_message",
        },
      },
      {
        title: "Only email",
        activeText: "Your users will log in using an email.",
        value: "EMAIL",
        variableMap: {
          sendCB_Node: "createAndSendCustomEmail: (input, context) => { /* See next step */ },",
          sendCB_Go:
            "CreateAndSendCustomEmail: func(email string, userInputCode *string, urlWithLinkCode *string, codeLifetime uint64, preAuthSessionId string, userContext supertokens.UserContext){ /* See next step */ },",
          sendCB_Python_def:
            "\nasync def send_email (email: str, userInputCode: Union[str, None], urlWithLinkCode: Union[str, None], codeLifetime: int, preAuthSessionId: str, userContext: Union[dict, None]):\n    # See next step\n",
          sendCB_Python: "create_and_send_custom_email=send_email",
        },
      },
      {
        title: "Email or phone number",
        activeText: "Your users will log in using an email or a phone number.",
        variableMap: {
          sendCB_Node:
            "createAndSendCustomEmail: (input, context) => { /* See next step */ },\ncreateAndSendCustomTextMessage: (input, context) => { /* See next step */ },",
          sendCB_Go:
            "CreateAndSendCustomEmail: func(email string, userInputCode *string, urlWithLinkCode *string, codeLifetime uint64, preAuthSessionId string, userContext supertokens.UserContext){ /* See next step */ },\nCreateAndSendCustomTextMessage: func(phoneNumber string, userInputCode *string, urlWithLinkCode *string, codeLifetime uint64, preAuthSessionId string, userContext supertokens.UserContext) { /* See next step */ },",
          sendCB_Python_def:
            "\nasync def send_text_message (phoneNumber: str, userInputCode: Union[str, None], urlWithLinkCode: Union[str, None], codeLifetime: int, preAuthSessionId: str, userContext: Union[dict, None]):\n    # See next step\n" +
            "\nasync def send_email (email: str, userInputCode: Union[str, None], urlWithLinkCode: Union[str, None], codeLifetime: int, preAuthSessionId: str, userContext: Union[dict, None]):\n    # See next step\n",
          sendCB_Python:
            "create_and_send_custom_text_message=send_text_message\ncreate_and_send_custom_email=send_email",
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
