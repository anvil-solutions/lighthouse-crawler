import { Parser as HtmlParser } from 'htmlparser2';
import { getFormattedUrlIfLocal } from './utils.js';

export const Parser = {

  /**
   * @param {string} baseUrl
   * @param {string} response
   * @returns {BasicPageData}
   */
  parse(baseUrl, response) {
    /** @type {Set<string>} */
    const links = new Set();

    /** @type {string | null} */
    let title = null;

    let isInTitle = false;

    const parser = new HtmlParser({

      /**
       * @param {string} name
       * @returns {void}
       */
      onclosetag(name) {
        if (name === 'title') isInTitle = false;
      },

      /**
       * @param {string} name
       * @param {Record<string, string>} attributes
       * @returns {void}
       */
      onopentag(name, attributes) {
        if (name === 'title') isInTitle = true;

        if (name === 'a' && 'href' in attributes) {
          const url = getFormattedUrlIfLocal(attributes.href, baseUrl);
          if (url !== null) links.add(url);
        }
      },

      /**
       * @param {string} text
       * @returns {void}
       */
      ontext(text) {
        if (isInTitle) title = (title ?? '') + text;
      }
    });
    parser.write(response);
    parser.end();

    return {
      links: [...links].sort((first, second) => first.localeCompare(second)),
      title
    };
  }
};

