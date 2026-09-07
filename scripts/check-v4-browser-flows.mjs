// Run the complete UI journeys against static files and mocked RPC, without a signer server.
import {spawn} from 'node:child_process';
import {staticPreview} from './static-preview.mjs';

const server=staticPreview('dist');
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
try{
  for(const script of ['check-v4-flow-regression.mjs','check-v4-habitat-regression.mjs']){
    await new Promise((resolve,reject)=>{
      const child=spawn(process.execPath,['scripts/'+script],{
        stdio:'inherit',
        env:{...process.env,V4_QA_ORIGIN:`http://127.0.0.1:${server.address().port}`}
      });
      child.once('error',reject);
      child.once('exit',code=>code===0?resolve():reject(new Error(`${script} exited ${code}`)));
    });
  }
}finally{
  await new Promise(resolve=>server.close(resolve));
}
