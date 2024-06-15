/**
 * @param {string} url
 * @returns {Promise<string | null>}
 */
export async function get(url) {
  try {
    const response = await fetch(url, { headers: { 'X-Test': '1' } });
    return await response.text();
  } catch {
    console.warn(`Could not fetch '${url}'!`);
    return null;
  }
}

/**
 * @param {string} url
 * @param {string} base
 * @returns {string | null}
 */
export function getFormattedUrlIfLocal(url, base) {
  if (URL.canParse(url) || url.startsWith('//')) return null;

  const parsedUrl = new URL(url, base);
  return parsedUrl.origin + parsedUrl.pathname;
}

/**
 * @param {string} url
 * @returns {string}
 */
export function getFormattedUrl(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.origin + parsedUrl.pathname;
}
