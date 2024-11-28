import React, {
	createContext,
	Children,
	PropsWithChildren,
	useState,
	useContext,
	useCallback,
	useEffect,
} from "react";
import { Card, Flex, Heading, RadioCards, Text } from "@radix-ui/themes";

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
		question: string | (() => JSX.Element);
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
			<Flex gap="2" direction="column" mb="4" py="5" px="4" asChild>
				<Card>
					<Heading as="h3" size="5">
						{typeof question === "string" ? question : question()}
					</Heading>

					<Flex direction="row" gap="2" align="start">
						<RadioCards.Root
							defaultValue={defaultAnswer}
							columns={{ initial: "1", sm: "2" }}
						>
							{children}
						</RadioCards.Root>
					</Flex>
				</Card>
			</Flex>
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
		<RadioCards.Item value={props.title} onClick={onClick}>
			<Flex direction="column" width="100%" height="100%" align="start">
				<Text weight="bold">{props.title}</Text>
			</Flex>
		</RadioCards.Item>
	);
}
