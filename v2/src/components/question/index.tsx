import React, {
  createContext,
  Children,
  PropsWithChildren,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";

import "./question.css";

type QuestionContextType = {
  answer?: string;
  setAnswer: (answer: string) => void;
};

const QuestionContext = createContext<QuestionContextType>(
  {} as QuestionContextType,
);

const LOCAL_STORAGE_KEY_PREFIX = "supertokens-question-answer:";

export function Question(
  props: PropsWithChildren<{
    question: string;
    defaultAnswer?: string;
  }>,
) {
  const { defaultAnswer, question, children } = props;
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    defaultAnswer,
  );

  const onSelectAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}:${question}`, answer);
  }, []);

  useEffect(() => {
    const storedAnswer = localStorage.getItem(
      `${LOCAL_STORAGE_KEY_PREFIX}:${question}`,
    );
    if (storedAnswer !== null) {
      setSelectedAnswer(storedAnswer);
    }
  }, []);

  const selectedAnswerChildren = Children.map(props.children, (child) => {
    if (!React.isValidElement(child)) return child;
    const childTitle = child.props.title;
    const childChildren = child.props.children;
    if (childTitle === selectedAnswer) {
      return childChildren;
    }
  });

  return (
    <QuestionContext.Provider
      value={{ answer: selectedAnswer, setAnswer: onSelectAnswer }}
    >
      <div className="question-box">
        <div className="question-box-text">{question}</div>
        <div className="question-box-answers">{children}</div>
      </div>
      {selectedAnswerChildren}
    </QuestionContext.Provider>
  );
}

type AnswerProps = {
  title: string;
  onClick?: () => void;
};

export function Answer(props: PropsWithChildren<AnswerProps>) {
  const { onClick: _onClick } = props;
  const { answer, setAnswer } = useContext(QuestionContext);
  const onClick = useCallback(() => {
    if (_onClick !== undefined) {
      _onClick();
    }
    setAnswer(props.title);
  }, []);

  return (
    <span
      className="question-box-answer"
      data-is-selected={answer === props.title}
      onClick={onClick}
    >
      {props.title}
    </span>
  );
}

