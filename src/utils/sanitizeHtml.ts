import sanitizeHtml from "sanitize-html";

const cleanHtml = (html: string): string => {
  return sanitizeHtml(html, {
    allowedTags: [
      "b",
      "i",
      "em",
      "strong",
      "a",
      "ul",
      "ol",
      "li",
      "p",
      "br",
      "h1",
      "h2",
      "h3",
      "u",
    ],
  });
};
export default cleanHtml;
