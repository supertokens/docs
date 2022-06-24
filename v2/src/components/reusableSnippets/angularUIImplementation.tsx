import React from "react";
import {Question, Answer} from "../question"

export default function AngularUIImplementation(props: any) {
  return (
    <Question
      question="What type of UI are you using?"
      id="angular-using-custom-ui-question"
    >
      <Answer title="Prebuilt UI"> {props.children} </Answer>
      <Answer title="Custom UI">
      <div className="admonition admonition-caution alert alert--warning">
          <div className="admonition-heading">
              <h5>
                  <span className="admonition-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z">
                          </path>
                      </svg>
                  </span>
                  Important
              </h5>
          </div>
          <div className="admonition-content">
          Please refer to the <b>Plain Javascript</b> section
          </div>
      </div>
        
      </Answer>
    </Question>
  );
}
