export type StatusStylesRecord = Record<
  EventStatus,
  { bg: string; text: string; label: string }
>

export const statusStyles: StatusStylesRecord = {
  "filling-fast": {
    bg: "bg-warning-tertiary",
    text: "text-secondary-9",
    label: "Filling fast",
  },
  "selling-fast": {
    bg: "bg-warning-tertiary",
    text: "text-secondary-9",
    label: "Selling fast",
  },
  "near-capacity": {
    bg: "bg-danger-tertiary",
    text: "text-secondary-9",
    label: "Near capacity",
  },
  new: {
    bg: "bg-accent-6",
    text: "text-white",
    label: "New",
  },
  "sold-out": {
    bg: "bg-white border border-danger-default/20",
    text: "text-danger-default",
    label: "Sold out",
  },
  "starts-soon": {
    bg: "bg-primary-1",
    text: "text-primary-9",
    label: "Starts soon",
  },
  draft: {
    bg: "bg-neutral-3",
    text: "text-neutral-7",
    label: "Draft",
  },
  active: {
    bg: "bg-postive-tertiary",
    text: "text-postive-default",
    label: "Active",
  },
  ended: {
    bg: "bg-neutral-3",
    text: "text-neutral-7",
    label: "Ended",
  },
  cancelled: {
    bg: "bg-white border border-danger-default/20",
    text: "text-danger-default",
    label: "Cancelled",
  },
  banned: {
    bg: "bg-white border border-danger-default/20",
    text: "text-danger-default",
    label: "Banned",
  },
};