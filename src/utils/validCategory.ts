export default function isValidCategory(
  category: string[],
  validCategory: string[]
): boolean {
  if (typeof category === "string") {
    return validCategory.includes(category);
  } else {
    return category.every((item) => validCategory.includes(item));
  }
}
