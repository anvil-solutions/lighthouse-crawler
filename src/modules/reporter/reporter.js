import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { Layout } from './layout.js';
import { Renderer } from '../renderer/renderer.js';
import { build } from 'esbuild';
import { getAverageScores } from '../lighthouse-runner/utils.js';
import path from 'node:path';

const OUT_DIR = './out/';

/**
 * @returns {Promise<void>}
 */
async function cleanOutput() {
  await rm(OUT_DIR, { force: true, recursive: true });
  await mkdir(OUT_DIR);
}

/**
 * @returns {Promise<void>}
 */
async function copyStaticAssets() {
  const entries = await readdir(
    './src/assets/static/',
    { recursive: true, withFileTypes: true }
  );
  await build({
    bundle: true,
    entryPoints: entries
      .filter(entry => entry.isFile())
      .map(entry => path.join(entry.parentPath, entry.name)),
    format: 'iife',
    minify: true,
    outdir: OUT_DIR,
    sourcemap: true
  });
}

/**
 * @param {PageData[]} pages
 * @returns {Promise<string>}
 */
async function createReport(pages) {
  await copyStaticAssets();

  const renderer = new Renderer(pages);
  const mainLayout = await Layout.fromAssets('main');
  const indexLayout = await Layout.fromAssets('index');
  const pageInfoLayout = await Layout.fromAssets('page-info');
  const linkListItemLayout = await Layout.fromAssets('link-list-item');
  const averageScores = getAverageScores(pages);

  mainLayout.addVariable('content', indexLayout);
  indexLayout
    .addVariable('performance', averageScores.performance?.toString() ?? '!')
    .addVariable(
      'accessibility',
      averageScores.accessibility?.toString() ?? '!'
    )
    .addVariable(
      'best_practices',
      averageScores['best-practices']?.toString() ?? '!'
    )
    .addVariable('seo', averageScores.seo?.toString() ?? '!')
    .addVariable(
      'pages',
      pages.map(
        page => Layout.from(linkListItemLayout)
          .addVariable('href', `#${page.path}`)
          .addVariable('text', page.path)
          .toString()
      ).join('')
    )
    .addVariable('full_diagram', renderer.links())
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
          .addVariable('title', page.title)
          .addVariable(
            'performance',
            page.result?.scores.performance?.toString() ?? '!'
          )
          .addVariable(
            'accessibility',
            page.result?.scores.accessibility?.toString() ?? '!'
          )
          .addVariable(
            'best_practices',
            page.result?.scores['best-practices']?.toString() ?? '!'
          )
          .addVariable('seo', page.result?.scores.seo?.toString() ?? '!')
          .addVariable('report', page.result?.file ?? 'about:blank')
          .addVariable('to_diagram', renderer.linksToPage(page))
          .addVariable('from_diagram', renderer.linksFromPage(page))
          .toString()
      ).join('')
    );

  await writeFile(path.join(OUT_DIR, 'index.html'), mainLayout.toString());
  return path.resolve(OUT_DIR, 'index.html');
}

export const Reporter = { cleanOutput, createReport };
