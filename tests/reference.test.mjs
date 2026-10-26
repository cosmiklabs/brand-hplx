import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildReference} from '../scripts/build-reference.mjs';
import {root,verifyTooling} from '../reference/tooling.mjs';
const output=fs.mkdtempSync(path.join(os.tmpdir(),'family-reference-'));
const result=await buildReference(output,{baseUrl:'https://cosmiklabs.github.io/brand-example/'});
const read=file=>fs.readFileSync(path.join(output,file),'utf8');
const files=fs.readdirSync(output,{recursive:true}).filter(f=>fs.statSync(path.join(output,f)).isFile());
process.on('exit',()=>fs.rmSync(output,{recursive:true,force:true}));
test('published pages have complete local links, assets and fragments',()=>{
 for(const file of files.filter(f=>f.endsWith('.html')||f.endsWith('.css'))){
 const text=read(file);
 const links=file.endsWith('.html')?[...text.matchAll(/(?:href|src|srcset)="([^"]+)"/g)].map(m=>m[1]):[...text.matchAll(/url\(['"]?([^)'" ]+)/g)].map(m=>m[1]);
 for(const link of links){if(/^(https?:|mailto:|data:|\/)/.test(link))continue;
 const [local,fragment]=link.split('#');const target=local?path.normalize(path.join(path.dirname(file),local)):file;
 assert.ok(fs.existsSync(path.join(output,target)),`${file}: missing ${link}`);
 if(fragment&&target.endsWith('.html'))assert.ok(read(target).includes(`id="${fragment}"`),`${file}: missing fragment ${link}`);
 }
 }
});
test('family pages keep their pinned foundation and reciprocal site navigation',()=>{
 for(const file of files.filter(f=>f.endsWith('.html')&&f!=='review-board.html')){
 const html=read(file);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file);
 for(const repo of ['brand','brand-hplx','brand-tectra'])assert.ok(html.includes(`https://cosmiklabs.github.io/${repo}/`));
 assert.ok(html.includes(`Cosmik ${result.foundation}`));
 assert.ok(html.indexOf('tokens/cosmik.css')<html.indexOf(`tokens/${result.family}.css`));
 }
 assert.ok(read('404.html').includes('<base href="/brand-example/">'));
});
test('approved downloads exclude historical identities and preserve font notices',()=>{
 assert.ok(files.some(f=>f.includes('Inter-OFL')));assert.ok(files.some(f=>f.includes('IBM-Plex-OFL')));
 if(result.family==='hplx'){
 assert.ok(files.some(f=>f.includes('Spectral-SemiBold.woff2')));
 assert.ok(!files.some(f=>/ember.*\.(svg|png|ico|icns)$/i.test(f)));
 }else assert.ok(!read('family-reference.css').includes('Spectral'));
 assert.equal((read('tokens.html').match(/data-token-group=/g)||[]).length,result.tokens);
});
test('tooling refuses unreviewed sources',()=>{
 const empty=fs.mkdtempSync(path.join(os.tmpdir(),'tooling-mismatch-'));
 try{assert.throws(()=>verifyTooling(empty),/content lock/);}finally{fs.rmSync(empty,{recursive:true,force:true});}
});


test('shared navigation labels, order and overview actions stay consistent',()=>{
 const home=read('index.html');
 const nav=home.match(/<nav aria-label="Reference">([\s\S]*?)<\/nav>/)[1];
 const groups=[...nav.matchAll(/class="eyebrow">([^<]+)/g)].map(m=>m[1]);
 assert.deepEqual(groups.filter(g=>g!=='Archive'),['Start here','Foundations','Experience','Implementation','Tools','Resources']);
 for(const label of ['Identity &amp; usage','Family contract','Quality review','Governance','Asset library','Design tokens','Component examples','Validation record'])assert.ok(nav.includes('>'+label+'</a>'),label);
 assert.ok(home.includes('placeholder="Search this guide…"'));
 assert.ok(home.includes('Read the brand guide'));
 assert.ok(home.includes('href="assets.html">Browse assets</a>'));
 const components=read('components.html');
 assert.ok(components.includes('aria-current="page">Component examples'));
 assert.ok(components.includes('aria-label="Brand references"'));
});
