import {
  BEST_PRACTICES,
  getAverageScores,
  getScoreColor,
  getScoreString
} from './utils.js';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { DiagramRenderer } from './diagram-renderer.js';
import { Layout } from './layout.js';
import { build } from 'esbuild';
import path from 'node:path';

export class Reporter {
  /** @type {string} */
  #outputDirectory;

  /**
   * @param {string} outputDirectory
   */
  constructor(outputDirectory) {
    this.#outputDirectory = path.normalize(outputDirectory);
  }

  /**
   * @returns {Promise<void>}
   */
  async cleanOutput() {
    await rm(this.#outputDirectory, { force: true, recursive: true });
    await mkdir(this.#outputDirectory);
  }

  /**
   * @returns {Promise<void>}
   */
  async #copyStaticAssets() {
    const entries = await readdir(
      path.join(import.meta.dirname, '../../assets/static/'),
      { recursive: true, withFileTypes: true }
    );
    await build({
      bundle: true,
      entryPoints: entries
        .filter(entry => entry.isFile())
        .map(entry => path.join(entry.parentPath, entry.name)),
      format: 'iife',
      minify: true,
      outdir: this.#outputDirectory,
      sourcemap: true
    });
  }

  /**
   * @param {PageData[]} pages
   * @returns {Promise<string>}
   */
  async createReport(pages) {
    await this.#copyStaticAssets();

    const diagramRenderer = new DiagramRenderer(pages);
    const mainLayout = await Layout.fromAssets('main');
    const indexLayout = await Layout.fromAssets('index');
    const pageInfoLayout = await Layout.fromAssets('page-info');
    const linkListItemLayout = await Layout.fromAssets('link-list-item');
    const averageScores = getAverageScores(pages);

    mainLayout.addVariable('content', indexLayout);
    indexLayout
      .addVariable('performance', getScoreString(averageScores.performance))
      .addVariable(
        'performance_color',
        getScoreColor(averageScores.performance)
      )
      .addVariable('accessibility', getScoreString(averageScores.accessibility))
      .addVariable(
        'accessibility_color',
        getScoreColor(averageScores.accessibility)
      )
      .addVariable(
        'best_practices',
        getScoreString(averageScores[BEST_PRACTICES])
      )
      .addVariable(
        'best_practices_color',
        getScoreColor(averageScores[BEST_PRACTICES])
      )
      .addVariable('seo', getScoreString(averageScores.seo))
      .addVariable('seo_color', getScoreColor(averageScores.seo))
      .addVariable(
        'pages',
        pages.map(
          page => Layout.from(linkListItemLayout)
            .addVariable('href', `#${page.path}`)
            .addVariable('text', page.path)
            .toString()
        ).join('')
      )
      .addVariable('full_diagram', diagramRenderer.links())
      .addVariable(
        'content',
        pages.map(
          page => Layout.from(pageInfoLayout)
            .addVariable(
              'links',
              page.links.map(link => {
                const linkPath = new URL(link).pathname;
                return Layout.from(linkListItemLayout)
                  .addVariable('href', `#${linkPath}`)
                  .addVariable('text', linkPath)
                  .toString();
              }).join('')
            )
            .addVariable('location', page.location)
            .addVariable('path', page.path)
            .addVariable('title', page.title ?? page.path)
            .addVariable(
              'performance',
              getScoreString(page.result?.scores.performance)
            )
            .addVariable(
              'performance_color',
              getScoreColor(page.result?.scores.performance)
            )
            .addVariable(
              'accessibility',
              getScoreString(page.result?.scores.accessibility)
            )
            .addVariable(
              'accessibility_color',
              getScoreColor(page.result?.scores.accessibility)
            )
            .addVariable(
              'best_practices',
              getScoreString(page.result?.scores[BEST_PRACTICES])
            )
            .addVariable(
              'best_practices_color',
              getScoreColor(page.result?.scores[BEST_PRACTICES])
            )
            .addVariable('seo', getScoreString(page.result?.scores.seo))
            .addVariable('seo_color', getScoreColor(page.result?.scores.seo))
            .addVariable('report', page.result?.file ?? 'about:blank')
            .addVariable('to_diagram', diagramRenderer.linksToPage(page))
            .addVariable('from_diagram', diagramRenderer.linksFromPage(page))
            .toString()
        ).join('')
      );

    await writeFile(
      path.join(this.#outputDirectory, 'index.html'),
      mainLayout.toString()
    );
    return path.resolve(this.#outputDirectory, 'index.html');
  }
}
