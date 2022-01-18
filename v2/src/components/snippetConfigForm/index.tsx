import React, { PropsWithChildren } from "react";
import { Question } from "./formQuestion";
import { recursiveMap } from "../utils";

/**
 * Difference between this and questions component:
 *   - Allows you to ask multiple questions one after the other
 *   - Saves the answers in localstorage and can be edited (like in appInfo component)
 *   - Allows children to have replaceable content based on the answer provided by the user.
 *   - It also displays answer post submission.
 *
 */

export type QuestionInfo<VarKeys extends keyof any> = {
  id: string;
  title: string;
  default?: string;
  options: { title: string; value: string; activeText?: string; variableMap?: Record<VarKeys, string> }[];
};

type Props<T extends keyof any> = {
  questions: QuestionInfo<T>[];
};

type State = {
  answers: (string | undefined)[];
};

const storageKeyPrefix = "snippetQuestionVal_";
const eventName = "snippetQuestionSelected";

// Registering the custom event on window for typescript. This avoids casts in the code
declare global {
  interface WindowEventMap {
    [eventName]: CustomEvent<{ detail: { source: any } }>;
  }
}

export default class SnippetConfigForm<T extends keyof any> extends React.PureComponent<
  PropsWithChildren<Props<T>>,
  State
> {
  constructor(props: PropsWithChildren<Props<T>>) {
    super(props);
    if (props.questions.length === 0) {
      throw new Error("You must ask at least one question in the form");
    }
    this.state = {
      answers: props.questions.map((info) => {
        if (typeof window !== "undefined") {
          const storedVal = window.localStorage.getItem(storageKeyPrefix + info.id);
          if (storedVal !== null && info.options.some((opt) => opt.value === storedVal)) {
            return storedVal;
          }
        }
        return info.default || undefined;
      }),
    };

    if (typeof window !== "undefined") {
      window.addEventListener(eventName, this.reloadState);
    }
  }

  reloadState = (event: CustomEvent) => {
    if (event.detail.source === this) {
      return;
    }
    this.setState((os) => ({
      ...os,
      answers: this.props.questions.map((info, ind) => {
        if (typeof window !== "undefined") {
          const storedVal = window.localStorage.getItem(storageKeyPrefix + info.id);
          if (storedVal !== null && info.options.some((opt) => opt.value === storedVal)) {
            return storedVal;
          }
        }
        return this.state.answers[ind];
      }),
    }));
  };

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener(eventName, this.reloadState);
    }
  }

  render() {
    return (
      <div>
        {this.props.questions.map((questionInfo, ind) => {
          return (
            <Question
              key={questionInfo.id}
              question={questionInfo.title}
              value={this.state.answers[ind]}
              options={questionInfo.options}
              onChange={(val) => {
                this.setState((oldState) => {
                  if (val !== undefined) {
                    window.localStorage.setItem(storageKeyPrefix + questionInfo.id, val);
                    window.dispatchEvent(new CustomEvent(eventName, { detail: { source: this } }));
                  }
                  return {
                    ...oldState,
                    answers: [...oldState.answers.slice(0, ind), val, ...oldState.answers.slice(ind + 1)],
                  };
                });
              }}
            />
          );
        })}

        {this.canContinue() &&
          recursiveMap(
            this.props.children,
            (c: any) => {
              if (typeof c === "string") {
                for (const [ind, question] of this.props.questions.entries()) {
                  const value = this.state.answers[ind];
                  c = c.replaceAll(`^{form_${question.id}}`, value);
                  const selectedAns = question.options.find((opt) => opt.value === value);
                  if (selectedAns && selectedAns.variableMap) {
                    for (const [name, value] of Object.entries<string>(selectedAns.variableMap)) {
                      const key = `form_${question.id}_${name}`;

                      c = replaceWithIndent(key, value, c).replaceAll(`^{${key}}`, value);
                    }
                  }
                }
              }
              return c;
            },
            (comp) => {
              return (
                comp.props.originalType !== ConditionalSection ||
                Object.entries(comp.props.conditions).every(([questionId, value]) => {
                  return this.state.answers[this.props.questions.findIndex((info) => info.id === questionId)] === value;
                })
              );
            },
          )}
      </div>
    );
  }

  canContinue = (newState?: State) => {
    const state = newState === undefined ? this.state : newState;
    for (let i = 0; i < this.props.questions.length; ++i) {
      const value = state.answers[i];
      if (value === undefined || value.length === 0) {
        return false;
      }
    }
    return true;
  };
}

type ConditionalSectionProps = {
  conditions: {
    questionId: string;
    value: string;
  }[];
};

export function ConditionalSection(props: PropsWithChildren<ConditionalSectionProps>) {
  return props.children;
}

function replaceWithIndent(target: string, replecement: string, str: string) {
  const regex = new RegExp(`(\\n\\s*)\\^{${target}}`, "g");

  return str.replace(regex, (match, p1) => {
    return p1 + replecement.replace(/\n/g, p1);
  });
}
