import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import { useDoc } from "@docusaurus/plugin-content-docs/client";
import TagsListInline from "@theme/TagsListInline";

import { motion } from "motion/react";
import EditMetaRow from "@theme/EditMetaRow";
import ThumbsUpIcon from "/img/icons/thumbs-up.svg";
import PenIcon from "/img/icons/pen.svg";
import ThumbsDownIcon from "/img/icons/thumbs-down.svg";

import { Box, Text, Flex, TextArea, Button, Dialog, RadioGroup } from "@radix-ui/themes";
import { trackFormSubmit, AnalyticsEventNames } from "@site/src/lib/analytics";

import "./index.scss";

export default function DocItemFooter(): JSX.Element | null {
  const { metadata } = useDoc();
  const { editUrl, frontMatter, lastUpdatedAt, lastUpdatedBy, tags } = metadata;
  const { showFeedback = true } = frontMatter;

  const canDisplayTagsRow = tags.length > 0;
  const canDisplayEditMetaRow = !!(editUrl || lastUpdatedAt || lastUpdatedBy);

  const canDisplayFooter = canDisplayTagsRow || canDisplayEditMetaRow || showFeedback;

  if (!canDisplayFooter) {
    return null;
  }

  return (
    <Box pt="8" asChild>
      <footer className={clsx(ThemeClassNames.docs.docFooter, "docusaurus-mt-lg")}>
        <Flex
          direction={{
            initial: "column",
            xs: "row",
          }}
          gap="4"
        >
          {showFeedback && <DocFeedback />}
          {canDisplayEditMetaRow && (
            <Flex
              ml={{
                initial: "0",
                xs: "auto",
              }}
            >
              <Button variant="ghost" color="gray" size="2" asChild>
                <a href={editUrl} target="_blank">
                  <PenIcon height="15" /> Suggest Edits
                </a>
              </Button>
            </Flex>
          )}
        </Flex>
        {/* {canDisplayTagsRow && ( */}
        {/*   <div className={clsx("row margin-top--sm", ThemeClassNames.docs.docFooterTagsRow)}> */}
        {/*     <div className="col"> */}
        {/*       <TagsListInline tags={tags} /> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* )} */}
      </footer>
    </Box>
  );
}

const PositiveOptionValues = {
  accurate: "accurate",
  solvedMyProblem: "solved my problem",
  easyToUnderstand: "easy to understand",
  helpedMeDecide: "helped me decide to use the product",
  other: "other reason",
} as const;

const NegativeOptionsValues = {
  inaccurate: "Inaccurate",
  couldNotFind: "could not find what I was looking for",
  hardToUnderstand: "hard to understand",
  codeSampleErrors: "code sample errors",
  other: "other reason",
};

function DocFeedback() {
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = React.useState(false);
  const [selectedReason, setSelectedReason] = React.useState<string | null>(null);
  const [feedback, setFeedback] = React.useState<string | null>(null);

  const onOpenChange = useCallback((isOpen) => {
    if (isOpen) return;
    setSelectedReason(null);
    setFeedback(null);
  }, []);
  const onSubmit = useCallback(() => {
    if (!selectedReason) return;

    trackFormSubmit(AnalyticsEventNames.formFeedback, "v1", {
      reason: selectedReason,
      feedback: feedback,
    });
    setHasSubmittedFeedback(true);
  }, [selectedReason, feedback]);

  if (hasSubmittedFeedback) {
    return (
      <Text size="4" weight="bold" className="feedback-submit-message">
        Thank you for your feedback!
      </Text>
    );
  }

  return (
    <Flex gap="4" align="center">
      <Text size="4" weight="bold">
        Was this page helpful?
      </Text>
      <Flex
        gap="2"
        ml={{
          initial: "auto",
          xs: "0",
        }}
      >
        <Dialog.Root onOpenChange={onOpenChange}>
          <Dialog.Trigger>
            <Button variant="solid" highContrast color="gray" size="1">
              <ThumbsUpIcon width="15" height="15" />
              Yes
            </Button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth="450px" asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Dialog.Title>What did you like?</Dialog.Title>
              <Flex mt="5" direction="column" gap="4" asChild>
                <RadioGroup.Root onValueChange={setSelectedReason} size="3">
                  <RadioGroup.Item value={PositiveOptionValues.accurate}>
                    <Flex gap="1" align="start" direction="column">
                      <Text size="4">Accurate</Text>
                      <Text color="gray" size="2">
                        Accurately describes the product or feature.
                      </Text>
                      {selectedReason === PositiveOptionValues.accurate && (
                        <AdditionalFeedbackTextArea onChange={setFeedback} />
                      )}
                    </Flex>
                  </RadioGroup.Item>
                  <RadioGroup.Item value={PositiveOptionValues.solvedMyProblem}>
                    <Flex gap="1" align="start" direction="column">
                      <Text size="4">Solved my problem</Text>
                      <Text color="gray" size="2">
                        Helped me resolve an issue.
                      </Text>
                      {selectedReason === PositiveOptionValues.solvedMyProblem && (
                        <AdditionalFeedbackTextArea onChange={setFeedback} />
                      )}
                    </Flex>
                  </RadioGroup.Item>
                  <RadioGroup.Item value={PositiveOptionValues.easyToUnderstand}>
                    <Flex gap="1" align="start" direction="column">
                      <Text size="4">Easy to understand</Text>
                      <Text color="gray" size="2">
                        Easy to follow and comprehend.
                      </Text>
                      {selectedReason === PositiveOptionValues.easyToUnderstand && (
                        <AdditionalFeedbackTextArea onChange={setFeedback} />
                      )}
                    </Flex>
                  </RadioGroup.Item>
                  <RadioGroup.Item value={PositiveOptionValues.helpedMeDecide}>
                    <Flex gap="1" align="start" direction="column">
                      <Text size="4">Helped me decide to use the product</Text>
                      <Text color="gray" size="2">
                        Convinced me to adopt the product or feature.
                      </Text>
                      {selectedReason === PositiveOptionValues.helpedMeDecide && (
                        <AdditionalFeedbackTextArea onChange={setFeedback} />
                      )}
                    </Flex>
                  </RadioGroup.Item>
                  <RadioGroup.Item value={PositiveOptionValues.other}>
                    <Text size="4">Another reason</Text>
                    {selectedReason === PositiveOptionValues.other && (
                      <AdditionalFeedbackTextArea onChange={setFeedback} />
                    )}
                  </RadioGroup.Item>
                </RadioGroup.Root>
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button disabled={!selectedReason} onClick={onSubmit}>
                    Submit
                  </Button>
                </Dialog.Close>
              </Flex>
            </motion.div>
          </Dialog.Content>
        </Dialog.Root>
        <Dialog.Root>
          <Dialog.Trigger>
            <Button variant="solid" highContrast color="gray" size="1">
              <ThumbsDownIcon width="15" height="15" />
              No
            </Button>
          </Dialog.Trigger>
          <Dialog.Content maxWidth="450px" asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Dialog.Title>What went wrong?</Dialog.Title>
              <Flex mt="5" direction="column" gap="4" asChild>
                <RadioGroup.Root onValueChange={setSelectedReason} size="3">
                  <RadioGroup.Item value={NegativeOptionsValues.inaccurate}>
                    <Flex gap="1" align="start" direction="column">
                      <Text size="4">Inaccurate</Text>
                      <Text color="gray" size="2">
                        Doesn't accurately describe the product or feature.
                      </Text>
                      {selectedReason === NegativeOptionsValues.inaccurate && (
                        <AdditionalFeedbackTextArea onChange={setFeedback} />
                      )}
                    </Flex>
                  </RadioGroup.Item>
                  <RadioGroup.Item value={NegativeOptionsValues.couldNotFind}>
                    <Flex gap="1" align="start" direction="column">
                      <Text size="4">Could not find</Text>
                      <Text color="gray" size="2">
                        Couldn't find what I was looking for.
                      </Text>
                      {selectedReason === NegativeOptionsValues.couldNotFind && (
                        <AdditionalFeedbackTextArea onChange={setFeedback} />
                      )}
                    </Flex>
                  </RadioGroup.Item>
                  <RadioGroup.Item value={NegativeOptionsValues.hardToUnderstand}>
                    <Flex gap="1" align="start" direction="column">
                      <Text size="4">Hard to understand</Text>
                      <Text color="gray" size="2">
                        Too complicated or unclear.
                      </Text>
                      {selectedReason === NegativeOptionsValues.hardToUnderstand && (
                        <AdditionalFeedbackTextArea onChange={setFeedback} />
                      )}
                    </Flex>
                  </RadioGroup.Item>
                  <RadioGroup.Item value={NegativeOptionsValues.codeSampleErrors}>
                    <Flex gap="1" align="start" direction="column">
                      <Text size="4">Code sample errors</Text>
                      <Text color="gray" size="2">
                        One or more code samples are incorrect.
                      </Text>
                      {selectedReason === NegativeOptionsValues.codeSampleErrors && (
                        <AdditionalFeedbackTextArea onChange={setFeedback} />
                      )}
                    </Flex>
                  </RadioGroup.Item>
                  <RadioGroup.Item value={NegativeOptionsValues.other}>
                    <Text size="4">Another reason</Text>
                    {selectedReason === NegativeOptionsValues.other && (
                      <AdditionalFeedbackTextArea onChange={setFeedback} />
                    )}
                  </RadioGroup.Item>
                </RadioGroup.Root>
              </Flex>
              <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                  <Button disabled={!selectedReason} onClick={onSubmit}>
                    Submit
                  </Button>
                </Dialog.Close>
              </Flex>
            </motion.div>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Flex>
  );
}

function AdditionalFeedbackTextArea({ onChange }: { onChange: (value: string) => void }) {
  return (
    <TextArea
      autoFocus
      onChange={(e) => onChange(e.target.value)}
      style={{ width: "350px" }}
      placeholder="(Optional) Try to be as specific as possible!"
      mt="2"
    />
  );
}
