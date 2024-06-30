/**
 * @param {string} url
 * @param {import("pino").Logger | null} logger
 * @returns {Promise<string | null>}
 */
export async function get(url, logger) {
  try {
    const response = await fetch(url, { headers: { 'X-Test': '1' } });
    if (
      response.headers.get(
        'Content-Type'
      )?.split(';')[0].toLowerCase() !== 'text/html'
    ) return null;
    return await response.text();
  } catch {
    logger?.warn('Could not fetch "%s".', url);
    return null;
  }
}

/**
 * @param {string} url
 * @param {string} base
 * @returns {string | null}
 */
export function getFormattedUrlIfLocal(url, base) {
  if (
    !URL.canParse(base) ||
    URL.canParse(url) && new URL(url).origin !== new URL(base).origin ||
    url.startsWith('//')
  ) return null;

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
