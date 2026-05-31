export type StatusStylesRecord = Record<
  EventStatus,
  { bg: string; text: string; label: string }
>

export const statusStyles: StatusStylesRecord = {
  "filling_fast": {
    bg: "bg-transparent",
    text: "text-primary-9",
    label: "Filling Fast",
  },
  "fast_selling": {
    bg: "bg-transparent",
    text: "text-primary-9",
    label: "Fast Selling",
  },
  "fast_filling": {
    bg: "bg-transparent",
    text: "text-primary-9",
    label: "Fast Filling",
  },
  "selling_fast": {
    bg: "bg-transparent",
    text: "text-primary-9",
    label: "Selling Fast",
  },

  "near_capacity": {
    bg: "bg-accent-1",
    text: "text-accent-7",
    label: "Near capacity",
  },
  new: {
    bg: "bg-accent-6",
    text: "text-white",
    label: "New",
  },
  normal: {
    bg: "bg-neutral-2",
    text: "text-neutral-7",
    label: "On Sale",
  },
  "on_sale": {
    bg: "bg-neutral-2",
    text: "text-neutral-7",
    label: "On Sale",
  },
  "sold_out": {
    bg: "bg-white border border-accent-6/20",
    text: "text-accent-6",
    label: "Sold out",
  },
  "starts_soon": {
    bg: "bg-primary-1",
    text: "text-primary-9",
    label: "Starts soon",
  },
  started: {
    bg: "bg-primary-1",
    text: "text-primary-9",
    label: "Started",
  },
  draft: {
    bg: "bg-neutral-3",
    text: "text-neutral-7",
    label: "Draft",
  },
  active: {
    bg: "bg-primary-1",
    text: "text-primary-9",
    label: "Active",
  },
  ended: {
    bg: "bg-neutral-3",
    text: "text-neutral-7",
    label: "Ended",
  },
  cancelled: {
    bg: "bg-white border border-neutral-6/20",
    text: "text-neutral-7",
    label: "Cancelled",
  },
  banned: {
    bg: "bg-white border border-accent-6/20",
    text: "text-accent-6",
    label: "Banned",
  },
};