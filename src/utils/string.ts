export function trimText(content: string) {
  if (typeof content === "string") return content.trim();
  return content;
}
