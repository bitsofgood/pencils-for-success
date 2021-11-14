export function generateChapterSlug(chapterName: string) {
  let slug = chapterName.trim().toLowerCase();
  slug = slug
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-\d]+/g, '') // Remove all non-word and no-digit chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

  return slug;
}
