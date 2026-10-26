/** Load the shared reference presentation, never another kit's brand inputs. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath,pathToFileURL} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function verifyTooling(directory){
 const lock=JSON.parse(fs.readFileSync(path.join(root,'reference/tooling.lock.json'),'utf8'));
 for(const [file,expected] of Object.entries(lock.files)){
  const full=path.join(directory,file);
  if(!fs.existsSync(full)||createHash('sha256').update(fs.readFileSync(full)).digest('hex')!==expected)throw Error(`Reference tooling differs from its content lock: ${file}. Use the reviewed cosmiklabs/brand checkout; do not change vendor/brand.`);
 }
 return directory;
}
export async function referenceTooling(){
 const directory=process.env.REFERENCE_TOOLING_ROOT||[path.join(root,'.reference-tooling'),path.resolve(root,'../brand')].find(p=>fs.existsSync(path.join(p,'scripts/build-family-reference.mjs')));
 if(!directory)throw Error('Reference tooling is missing. Provide the reviewed brand checkout at ../brand or .reference-tooling, or set REFERENCE_TOOLING_ROOT. See reference/README.md.');
 verifyTooling(directory);
 return import(pathToFileURL(path.join(directory,'scripts/build-family-reference.mjs')).href);
}
