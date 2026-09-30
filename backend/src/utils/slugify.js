export const slugify = (s) =>
  s.toString().toLowerCase().trim().normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// "amla-powder", then "amla-powder-2" if taken
export async function uniqueSlug(Model, text, excludeId) {
  const base = slugify(text) || 'item';
  let slug = base;
  let i = 1;
  while (await Model.exists({ slug, ...(excludeId && { _id: { $ne: excludeId } }) })) {
    slug = `${base}-${++i}`;
  }
  return slug;
}