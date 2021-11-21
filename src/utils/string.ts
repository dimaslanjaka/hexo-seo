export function trimText(content: string) {
  if (typeof content === "string") return content.trim();
  console.log("trimText", content, typeof content);
}
