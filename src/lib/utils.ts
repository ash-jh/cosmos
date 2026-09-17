import { type ClassValue, clsx } from "clsx";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(ts: number) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(ts));
export function formatTimestamp(ts: number | undefined): string {
  if (!ts) return "N/A";
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function formatNumber(val: number | undefined, decimals: number = 2) {
  if (val === undefined) return "-";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
export function formatNumber(val: number | undefined, decimals = 2): string {
  if (val === undefined || val === null) return "N/A";
  return val.toFixed(decimals);
}
