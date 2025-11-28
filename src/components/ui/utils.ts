import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS class names intelligently.
 * Combines multiple class values and resolves conflicts using tailwind-merge.
 * 
 * @param classInputs - Class values to merge (strings, arrays, objects, or conditional expressions)
 * @returns A single merged class string
 * 
 * @example
 * mergeClassNames("px-2 py-1", condition && "bg-blue-500", "px-4")
 * // Returns: "py-1 bg-blue-500 px-4" (px-4 overrides px-2)
 */
export function mergeClassNames(...classInputs: ClassValue[]): string {
  return twMerge(clsx(classInputs));
}

// Backwards-compatible alias (commonly used shorthand in the React/Tailwind ecosystem)
export const cn = mergeClassNames;
