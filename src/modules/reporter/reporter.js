import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { Layout } from './layout.js';
import { Renderer } from '../renderer/renderer.js';
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
  await cp('./src/assets/static/', OUT_DIR, { recursive: true });
}

/**
 * @param {PageData[]} pages
 * @returns {Promise<string>}
 */
async function createReport(pages) {
  await cleanOutput();
  await copyStaticAssets();

  const renderer = new Renderer(pages);
  const mainLayout = await Layout.fromAssets('main');
  const indexLayout = await Layout.fromAssets('index');
  const pageInfoLayout = await Layout.fromAssets('page-info');
  const listItemLayout = await Layout.fromAssets('list-item');

  mainLayout.addVariable('content', indexLayout);
  indexLayout
    .addVariable('full_diagram', renderer.links())
    .addVariable(
      'content',
      pages.map(
        page => Layout.from(pageInfoLayout)
          .addVariable(
            'links',
            page.links.map(
              link => Layout.from(listItemLayout)
                .addVariable('content', new URL(link).pathname)
                .toString()
            ).join('')
          )
          .addVariable('location', page.location)
          .addVariable('path', page.path)
          .addVariable('title', page.title)
          .addVariable('to_diagram', renderer.linksToPage(page))
          .addVariable('from_diagram', renderer.linksFromPage(page))
          .toString()
      ).join('')
    );

  await writeFile(path.join(OUT_DIR, 'index.html'), mainLayout.toString());
  return path.resolve(OUT_DIR, 'index.html');
}

export const Reporter = { createReport };
