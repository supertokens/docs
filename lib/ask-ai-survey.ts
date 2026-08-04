export const feedbackReasons = ["incorrect", "outdated", "incomplete", "unclear", "bad-citation", "other"] as const;

export type FeedbackReason = (typeof feedbackReasons)[number];

export interface AskAiSurveyConfig {
  commentQuestionId: string;
  ratingQuestionId: string;
  reasonQuestionId: string;
  surveyId: string;
}

export interface AskAiAnswerMetadata {
  conversationId: string;
  inputSource: "manual" | "suggestion";
  latencyMs: number;
  messages: { content: string; role: "assistant" | "user" }[];
  pagePath: string;
  timeToFirstTokenMs: number | null;
  traceId: string;
}

const feedbackReasonLabels: Record<FeedbackReason, string> = {
  "bad-citation": "Bad or missing citation",
  incomplete: "Incomplete",
  incorrect: "Incorrect",
  other: "Other",
  outdated: "Outdated",
  unclear: "Unclear",
};

export const toAskAiSurveyProperties = ({
  answer,
  answerId,
  comment,
  metadata,
  rating,
  reason,
  submissionId,
  survey,
}: {
  answer: string;
  answerId: string;
  comment: string;
  metadata: AskAiAnswerMetadata;
  rating: "helpful" | "not-helpful";
  reason: FeedbackReason | null;
  submissionId: string;
  survey: AskAiSurveyConfig;
}): Record<string, unknown> => ({
  $ai_input: metadata.messages
    .filter(({ role }) => role === "user")
    .map(({ content, role }) => ({ content, role })),
  $ai_output_choices: [{ content: answer, role: "assistant" }],
  $ai_session_id: metadata.conversationId,
  $ai_span_id: answerId,
  $ai_trace_id: metadata.traceId,
  $survey_completed: true,
  $survey_id: survey.surveyId,
  [`$survey_response_${survey.ratingQuestionId}`]: rating === "helpful" ? "Helpful" : "Not helpful",
  $survey_submission_id: submissionId,
  ai_answer: answer,
  ai_answer_id: answerId,
  ai_conversation: metadata.messages.map(({ content, role }) => ({ content, role })),
  ai_input_source: metadata.inputSource,
  ai_latency_ms: metadata.latencyMs,
  ai_page_path: metadata.pagePath,
  ai_question: metadata.messages.filter(({ role }) => role === "user").at(-1)?.content,
  ai_time_to_first_token_ms: metadata.timeToFirstTokenMs,
  ...(reason ? { [`$survey_response_${survey.reasonQuestionId}`]: feedbackReasonLabels[reason] } : {}),
  ...(comment.trim() ? { [`$survey_response_${survey.commentQuestionId}`]: comment.trim() } : {}),
});
