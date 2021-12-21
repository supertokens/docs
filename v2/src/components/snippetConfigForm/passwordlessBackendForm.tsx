import React from 'react';

import SnippetQuestionForm from "./index";
import { passwordlessQuestions } from "./passwordlessQuestions";

export function PasswordlessFrontendForm(props) {
  return (
    <SnippetQuestionForm questions={[passwordlessQuestions.contactMethod, passwordlessQuestions.flowType]}>
      {props.children}
    </SnippetQuestionForm>
  );
}

export { ConditionalSection } from "./index";
