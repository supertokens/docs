import React from 'react';

import SnippetQuestionForm from "./index";
import { passwordlessQuestions } from "./passwordlessQuestions";

export function PasswordlessFrontendForm(props: any) {
  return <SnippetQuestionForm questions={[passwordlessQuestions.contactMethod]}>{props.children}</SnippetQuestionForm>;
}

export { ConditionalSection } from "./index";
