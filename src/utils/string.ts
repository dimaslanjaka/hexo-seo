export function trimText(content: string) {
  if (typeof content === "string") return content.trim();
  console.log(content, typeof content);
}
