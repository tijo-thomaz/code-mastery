import type { FieldValidator } from "./types";

export const minLength = (len: number, msg?: string): FieldValidator =>
  (value) => value && value.length < len ? (msg ?? `Must be at least ${len} characters`) : null;

export const maxLength = (len: number, msg?: string): FieldValidator =>
  (value) => value && value.length > len ? (msg ?? `Must be at most ${len} characters`) : null;

export const pattern = (regex: RegExp, msg?: string): FieldValidator =>
  (value) => value && !regex.test(value) ? (msg ?? "Invalid format") : null;

export const exactLength = (len: number, msg?: string): FieldValidator =>
  (value) => value && value.replace(/\D/g, "").length !== len ? (msg ?? `Must be exactly ${len} digits`) : null;

export const email: FieldValidator =
  (value) => value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Invalid email address" : null;

export const minAge = (age: number, msg?: string): FieldValidator =>
  (value) => {
    if (!value) return null;
    const years = new Date().getFullYear() - new Date(value).getFullYear();
    return years < age ? (msg ?? `Must be at least ${age}`) : null;
  };
