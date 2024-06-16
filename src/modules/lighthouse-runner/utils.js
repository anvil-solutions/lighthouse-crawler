/**
 * @param {number} number
 * @returns {string}
 */
export function padNumber(number) {
  return number.toString().padStart(3);
}

/**
 * @param {string} message
 * @returns {void}
 */
export function logOnSameLine(message) {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(message);
}
