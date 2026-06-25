/**
 * Strip characters from user-supplied strings before embedding them in AI prompts.
 * Removes control characters (including newlines that could inject new instructions)
 * and delimiter chars that could break out of prompt context.
 */
export function sanitizePromptInput(input: string, maxLen = 200): string {
  return input
    .replace(/[\x00-\x1F\x7F]/g, " ")
    .replace(/[`"\\{}[\]]/g, "")
    .trim()
    .slice(0, maxLen);
}
