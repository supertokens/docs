import React from 'react';

import SnippetQuestionForm from "./index";
import { passwordlessQuestions } from "./passwordlessQuestions";

export function PasswordlessBackendForm(props: any) {
  return (
    <SnippetQuestionForm questions={[passwordlessQuestions.contactMethod, passwordlessQuestions.flowType]}>
      {props.children}
    </SnippetQuestionForm>
  );
}

export { ConditionalSection } from "./index";
