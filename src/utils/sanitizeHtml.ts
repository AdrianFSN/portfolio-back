import he from "he";
import sanitizeHtml from "sanitize-html";

const decodeHtmlEntities = (html: string): string => {
  return he.decode(html);
};

const cleanHtml = (html: string): string => {
  const decodedHtml = decodeHtmlEntities(html);
  return sanitizeHtml(decodedHtml, {
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
