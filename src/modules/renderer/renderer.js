export class Renderer {
  /** @type {PageData[]} */
  #pages;

  /** @type {[string, string][]} */
  #links;

  /** @type {Map<string, PageData>} */
  #pageMap = new Map();

  /**
   * @param {PageData[]} pages
   */
  constructor(pages) {
    this.#pages = pages;
    this.#links = this.#pages
      .flatMap(from => from.links.map(to => [from.location, to]))
      .filter(
        ([from, to]) => from !== to &&
          !this.#pages.every(page => page.links.includes(to))
      )
      .map(([from, to]) => [new URL(from).pathname, new URL(to).pathname]);

    for (const page of this.#pages) this.#pageMap.set(page.path, page);
  }

  /**
   * @param {PageData | null} page
   * @returns {string}
   */
  static page(page) {
    if (page === null) return '';

    return `
      ${page.path}("${page.title}")
      click ${page.path} "#${page.path}"
      `;
  }

  /**
   * @returns {string}
   */
  links() {
    /* eslint-disable @stylistic/indent */
    return `
      flowchart LR
      ${this.#pages.map(page => Renderer.page(page)).join('\n')}
      ${
        this.#links
          .map(
            ([from, to]) => `
              ${from} --> ${to}
              `
          )
          .join('\n')
      }
      `;
    /* eslint-enable @stylistic/indent */
  }

  /**
   * @param {PageData} page
   * @returns {string}
   */
  linksToPage(page) {
    /* eslint-disable @stylistic/indent */
    return `
      flowchart LR
      ${Renderer.page(page)}
      ${
        this.#links
          .filter(link => link[1] === page.path)
          .map(
            ([from, to]) => `
              ${Renderer.page(this.#pageMap.get(from) ?? null)}
              ${from} --> ${to}
              `
          )
          .join('\n')
      }
      `;
    /* eslint-enable @stylistic/indent */
  }

  /**
   * @param {PageData} page
   * @returns {string}
   */
  linksFromPage(page) {
    /* eslint-disable @stylistic/indent */
    return `
      flowchart LR
      ${Renderer.page(page)}
      ${
        this.#links
          .filter(link => link[0] === page.path)
          .map(
            ([from, to]) => `
              ${Renderer.page(this.#pageMap.get(to) ?? null)}
              ${from} --> ${to}
              `
          )
          .join('\n')
      }
      `;
    /* eslint-enable @stylistic/indent */
  }
}
