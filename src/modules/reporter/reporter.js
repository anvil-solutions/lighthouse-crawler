import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { Layout } from './layout.js';
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
 * @param {PageData[]} pageData
 * @returns {Promise<string>}
 */
async function createReport(pageData) {
  await cleanOutput();
  await copyStaticAssets();

  const mainLayout = await Layout.fromAssets('main');
  await writeFile(
    path.join(OUT_DIR, 'index.html'),
    mainLayout.addVariable('raw', JSON.stringify(pageData, null, 2)).toString()
  );

  return path.resolve(OUT_DIR, 'index.html');
}

export const Reporter = { createReport };
