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
 assert.ok(!home.includes('historical.html'));
 assert.ok(!fs.existsSync(path.join(output,'historical.html')));
 const header=home.match(/<header class="site-header">([\s\S]*?)<\/header>/)[1];
 assert.ok(header.includes('<span>HPLX</span>'), 'the header uses a live UI label');
 assert.match(header, /class="identity-symbol identity-symbol--/);
 assert.doesNotMatch(header, /lockup[^" ]*\.svg/, 'full wordmarks belong in artwork previews, not the compact header');
 assert.ok(home.includes('href="guide.html">Read the brand guide'));
 for(const page of ['index.html','assets.html',"family-guide.html"]){
  const body=read(page);assert.match(body,/data-theme="dark"[\s\S]*data-theme="light"/);
 }

 const nav=home.match(/<nav aria-label="Reference">([\s\S]*?)<\/nav>/)[1];
 assert.match(nav, /href="index.html"[^>]*>Overview<\/a>[\s\S]*?href="guide.html"[^>]*>Guide index<\/a>/);
 assert.ok(read('guide.html').includes('aria-current="page">Guide index'));
 const groups=[...nav.matchAll(/class="eyebrow">([^<]+)/g)].map(m=>m[1]);
 assert.deepEqual(groups,['Start here','Foundations','Experience','Implementation','Tools','Resources']);
 for(const label of ['Identity &amp; usage','Family contract','Quality review','Governance','Asset library','Design tokens','Component examples','Validation record'])assert.ok(nav.includes('>'+label+'</a>'),label);
 assert.ok(home.includes('placeholder="Search this guide…"'));
 assert.ok(home.includes('Read the brand guide'));
 assert.ok(home.includes('href="assets.html">Browse assets</a>'));
 const components=read('components.html');
 assert.ok(components.includes('aria-current="page">Component examples'));
 assert.ok(components.includes('aria-label="Brand references"'));
});


test('voice guidance combines current product wording with immutable shared rules',()=>{
 const voice=read('voice.html');
 assert.match(voice,/id="product-presentation"/);
 assert.match(voice,/Product source/);
 assert.match(voice,/Pinned shared source/);
 assert.match(voice,/The vendored source remains unchanged/);
 assert.doesNotMatch(voice,/No replacement motto or organisation-wide descriptor is approved/);
 assert.match(voice,/Useful, direct language/);
 assert.match(voice,/Imagery and icons/);
 const index=JSON.parse(read('search-index.js').replace(/^window.CosmikReferenceIndex=/,'').trim().replace(/;$/,''));
 const entry=index.find(page=>page.url==='voice.html');
 assert.match(entry.text,/Product presentation/);
 assert.doesNotMatch(entry.text,/No replacement motto or organisation-wide descriptor is approved/);
 assert.ok(entry.sections.some(section=>section.id==='product-presentation'));
});
