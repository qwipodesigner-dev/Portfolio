/**
 * Typography normalization applied to all content as it is read.
 * House style: plain hyphens, never em/en dashes - so content from
 * the database (or pasted into the admin from Word/Figma, which
 * loves smart dashes) always renders with "-" without anyone having
 * to police it.
 */
export function plainHyphens<T>(value: T): T {
  if (typeof value === "string") {
    // — em dash, – en dash (unicode escapes so tooling that
    // strips literal dashes can never break this regex)
    return value.replace(/[—–]/g, "-") as T;
  }
  if (Array.isArray(value)) {
    return value.map(plainHyphens) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, plainHyphens(v)]),
    ) as T;
  }
  return value;
}
