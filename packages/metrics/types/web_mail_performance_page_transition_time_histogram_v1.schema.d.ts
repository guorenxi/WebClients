/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Time to transition and components being mounted
 */
export interface PageTransitionTime {
  Value: number;
  Labels: {
    from:
      | "inbox"
      | "all-drafts"
      | "all-sent"
      | "trash"
      | "spam"
      | "all-mail"
      | "almost-all-mail"
      | "archive"
      | "sent"
      | "drafts"
      | "starred"
      | "outbox"
      | "scheduled"
      | "snoozed"
      | "custom";
    to:
      | "inbox"
      | "all-drafts"
      | "all-sent"
      | "trash"
      | "spam"
      | "all-mail"
      | "almost-all-mail"
      | "archive"
      | "sent"
      | "drafts"
      | "starred"
      | "outbox"
      | "scheduled"
      | "snoozed"
      | "custom";
  };
}