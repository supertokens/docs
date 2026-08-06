import { describe, expect, it } from "vitest";

import { toAskAiSurveyProperties } from "./ask-ai-survey";

describe("toAskAiSurveyProperties", () => {
  it("records the selected rating and full conversation", () => {
    const properties = toAskAiSurveyProperties({
      answer: "Use the Session recipe.",
      answerId: "answer-1",
      comment: "",
      metadata: {
        conversationId: "conversation-1",
        inputSource: "manual",
        latencyMs: 1250,
        messages: [
          { content: "How do sessions work?", role: "user" },
          { content: "Use the Session recipe.", role: "assistant" },
        ],
        pagePath: "/",
        timeToFirstTokenMs: 250,
        traceId: "trace-1",
      },
      rating: "helpful",
      reason: null,
      submissionId: "submission-1",
      survey: {
        commentQuestionId: "comment-question",
        ratingQuestionId: "rating-question",
        reasonQuestionId: "reason-question",
        surveyId: "survey-1",
      },
    });

    expect(properties).toMatchObject({
      $ai_session_id: "conversation-1",
      $ai_trace_id: "trace-1",
      ["$survey_response_rating-question"]: "Helpful",
      ai_answer: "Use the Session recipe.",
      ai_conversation: [
        { content: "How do sessions work?", role: "user" },
        { content: "Use the Session recipe.", role: "assistant" },
      ],
    });
  });

  it("records reason and trimmed optional comment", () => {
    const properties = toAskAiSurveyProperties({
      answer: "Answer",
      answerId: "answer-1",
      comment: "  Needs an update.  ",
      metadata: {
        conversationId: "conversation-1",
        inputSource: "suggestion",
        latencyMs: 100,
        messages: [{ content: "Question", role: "user" }],
        pagePath: "/",
        timeToFirstTokenMs: null,
        traceId: "trace-1",
      },
      rating: "not-helpful",
      reason: "outdated",
      submissionId: "submission-1",
      survey: {
        commentQuestionId: "comment-question",
        ratingQuestionId: "rating-question",
        reasonQuestionId: "reason-question",
        surveyId: "survey-1",
      },
    });

    expect(properties["$survey_response_reason-question"]).toBe("Outdated");
    expect(properties["$survey_response_comment-question"]).toBe("Needs an update.");
  });
});
