const STOP_WORDS = [
  "the", "is", "and", "or", "to", "of", "in", "for", "with"
];

const CATEGORY_TAGS = {
  programming: ["coding", "development"],
  fitness: ["workout", "health"],
  tech: ["technology", "gadgets"],
  education: ["learning", "study"],
  entertainment: ["fun", "video"],
  gaming: ["games", "gameplay"],
  vlog: ["daily", "life"],
};

export function generateTags(title, description, category) {
  const text = `${title} ${description}`.toLowerCase();

  const words = text
    .replace(/[^a-z0-9\s]/g, "")
    .split(" ")
    .filter(
      w => w.length > 2 && !STOP_WORDS.includes(w)
    );

  const autoTags = [...new Set(words)].slice(0, 8);
  const categoryTags = CATEGORY_TAGS[category] || [];

  return [...new Set([...autoTags, ...categoryTags])];
}
