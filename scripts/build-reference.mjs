import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {root,referenceTooling} from '../reference/tooling.mjs';
export async function buildReference(output=path.join(root,'site'),options={}){
 const {buildFamilyReference}=await referenceTooling();
 return buildFamilyReference(root,output,options);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const output=path.join(root,'site');fs.rmSync(output,{recursive:true,force:true});
 const result=await buildReference(output,{baseUrl:process.env.REFERENCE_BASE_URL});
 console.log(`Built ${result.pages} ${result.family} reference pages; ${result.tokens} CSS tokens; foundation ${result.foundation}.`);
}
