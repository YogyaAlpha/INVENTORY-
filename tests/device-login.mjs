import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtempSync, rmSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import assert from 'node:assert/strict';
const dir = mkdtempSync(join(tmpdir(), 'gemflow-test-'));
let mail = '';
const smtp = createServer(socket => {
  socket.write('220 localhost test\r\n'); let data = '', receiving = false;
  socket.on('data', chunk => {
    data += chunk.toString();
    while (data.includes('\r\n')) {
      const i = data.indexOf('\r\n'), line = data.slice(0,i); data = data.slice(i+2);
      if (receiving) { if(line === '.') {receiving=false;socket.write('250 accepted\r\n');} else mail += line+'\n'; continue; }
      if (/^EHLO/.test(line)) socket.write('250-localhost\r\n250 AUTH PLAIN LOGIN\r\n');
      else if (/^DATA/.test(line)) { receiving=true; socket.write('354 send\r\n'); }
      else if (/^QUIT/.test(line)) { socket.end('221 bye\r\n'); }
      else if (/^AUTH/.test(line)) socket.write('235 authenticated\r\n');
      else socket.write('250 ok\r\n');
    }
  });
});
await new Promise(r=>smtp.listen(0,'127.0.0.1',r));
const smsFile = join(dir, 'sms.json');
const mockFile = join(dir, 'sms-mock.mjs');
writeFileSync(mockFile, `import {writeFileSync} from 'node:fs';const original=globalThis.fetch;globalThis.fetch=async(url,options)=>{if(String(url).startsWith('https://api.twilio.com/')){writeFileSync(process.env.TEST_SMS_FILE,JSON.stringify(Object.fromEntries(options.body)));return new Response('{}',{status:201});}return original(url,options);};`);
const server=spawn(process.execPath,['--import',mockFile,'server.js'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:'3198',JWT_SECRET:'test-only-jwt-secret-never-used-for-live-accounts',NODE_ENV:'production',APP_URL:'https://gemflow-trial.example',TEST_SMS_FILE:smsFile,TWILIO_ACCOUNT_SID:'mock-sid',TWILIO_AUTH_TOKEN:'mock-token',TWILIO_PHONE_NUMBER:'+15005550006',GEMFLOW_DATA_DIR:dir,SMTP_HOST:'127.0.0.1',SMTP_PORT:String(smtp.address().port),SMTP_USER:'test',SMTP_PASS:'test',SMTP_SECURE:'false',ADMIN_EMAIL:'admin@test.local',ADMIN_PASSWORD:'test-admin-password'}});
let output='';server.stdout.on('data',x=>output+=x);server.stderr.on('data',x=>output+=x);
const call=async(path,body,token)=>{const r=await fetch('http://127.0.0.1:3198/api/'+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,...await r.json()};};
try {
  for(let i=0;i<100;i++){try{if((await call('health')).status===200)break;}catch{}await new Promise(r=>setTimeout(r,50));}
  assert.equal((await call('auth/register',{name:'Test',companyName:'Test',email:'user@test.local',phone:'+919999999999',password:'password123'})).status,201);
  const db=new DatabaseSync(join(dir,'gemflow.sqlite'));db.prepare("UPDATE users SET status='approved'").run();
  const login=id=>call('auth/login',{identifier:'user@test.local',password:'password123',deviceId:id});
  const tokens=[];for(const id of ['one','two','three']){const r=await login(id);assert.ok(r.token);tokens.push(r.token);}
  assert.ok((await login('one')).token);
  const fourth=await login('four');assert.equal(fourth.deviceLimit,true);assert.equal(fourth.devices.length,3);assert.equal(fourth.token,undefined);
  const payload={challengeId:fourth.challengeId,deviceId:'four',sessionId:db.prepare('SELECT id FROM user_sessions WHERE device_id=?').get('one').id};
  assert.equal((await call('auth/device-login/verify',{...payload,otp:'123456'})).status,400);
  assert.equal((await call('auth/device-login/send-otp',{...payload,deviceId:'wrong'})).status,400);
  assert.equal((await call('auth/device-login/send-otp',payload)).status,200);
  assert.match(mail,/To: user@test.local/);const otp=mail.match(/code is (\d{6})/)[1];
  assert.equal((await call('auth/device-login/send-otp',payload)).status,429);
  assert.equal((await call('auth/device-login/verify',{...payload,otp:'000000'})).status,401);
  assert.equal((await call('auth/me',null,tokens[0])).status,200);
  const result=await call('auth/device-login/verify',{...payload,otp});assert.ok(result.token);
  assert.equal((await call('auth/me',null,tokens[0])).status,401);
  for(const token of tokens.slice(1))assert.equal((await call('auth/me',null,token)).status,200);
  assert.equal((await call('auth/me',null,result.token)).status,200);
  assert.equal(db.prepare('SELECT COUNT(*) count FROM user_sessions').get().count,3);
  assert.equal((await call('auth/device-login/verify',{...payload,otp})).status,400);
  const fifth=await login('five'); const base={challengeId:fifth.challengeId,deviceId:'five',sessionId:fifth.devices[0].id};
  db.prepare('UPDATE device_login_challenges SET otp_hash=?,otp_expires_at=?,attempts=5 WHERE id=?').run('test',Date.now()+10000,fifth.challengeId);
  assert.equal((await call('auth/device-login/verify',{...base,otp:'123456'})).status,429);
  db.prepare('UPDATE device_login_challenges SET expires_at=0 WHERE id=?').run(fifth.challengeId);
  assert.equal((await call('auth/device-login/send-otp',base)).status,400);
  // Email recovery uses the public origin, serves a complete reset screen, and consumes links once.
  mail = '';
  assert.equal((await call('auth/forgot-password',{email:'user@test.local'})).status,200);
  mail = mail.replace(/=\n/g, '').replace(/=3D/g, '=');
  const resetToken = mail.match(/token=([a-f0-9]{64})/)[1];
  assert.ok(mail.includes('https://gemflow-trial.example/reset-password?token='));
  assert.ok(!mail.includes('http://localhost'));
  assert.equal((await fetch(`http://127.0.0.1:3198/reset-password?token=${resetToken}`)).status,200);
  assert.equal((await call('auth/reset-password',{token:resetToken,password:'newPassword123'})).status,200);
  assert.equal((await call('auth/reset-password',{token:resetToken,password:'newPassword123'})).status,400);
  assert.equal((await call('auth/me',null,result.token)).status,401);
  assert.equal((await login('one')).status,401);
  const afterEmail = await call('auth/login',{identifier:'user@test.local',password:'newPassword123',deviceId:'email-device'});
  assert.ok(afterEmail.token);
  // SMS provider is mocked locally; no real message or external request is sent.
  assert.equal((await call('auth/request-password-reset-otp',{phone:'9999999999'})).status,200);
  const sms = JSON.parse(readFileSync(smsFile));
  assert.equal(sms.To,'+919999999999');assert.match(sms.Body,/password reset/);
  const resetOtp = sms.Body.match(/OTP is (\d{6})/)[1];
  assert.equal((await call('auth/request-password-reset-otp',{phone:'+919999999999'})).status,429);
  assert.equal((await call('auth/reset-password-with-otp',{phone:'9999999999',otp:'000000',password:'smsPassword123'})).status,401);
  assert.equal((await call('auth/login-with-otp',{phone:'9999999999',otp:resetOtp,deviceId:'bypass'})).status,400);
  assert.equal((await call('auth/reset-password-with-otp',{phone:'9999999999',otp:resetOtp,password:'smsPassword123'})).status,200);
  assert.equal((await call('auth/reset-password-with-otp',{phone:'9999999999',otp:resetOtp,password:'smsPassword123'})).status,400);
  assert.equal((await call('auth/me',null,afterEmail.token)).status,401);
  assert.ok((await call('auth/login',{identifier:'user@test.local',password:'smsPassword123',deviceId:'sms-device'})).token);
  db.prepare('UPDATE password_reset_tokens SET expires_at=0').run();
  assert.equal((await call('auth/reset-password',{token:resetToken,password:'anotherPassword'})).status,400);
  assert.equal((await fetch('http://127.0.0.1:3198/recover-password')).status,200);
  console.log('PASS: public reset URL, reset routes, single-use email link, email and SMS password changes, E.164 normalization, SMS cooldown, wrong OTP, purpose isolation, replay prevention and session revocation.');
  db.close();console.log('PASS: three-device limit, existing-device login, SMTP email OTP, device binding, resend cooldown, wrong code, revocation, unaffected devices, replay, expiry and attempt limit.');
} finally {server.kill();smtp.close();await new Promise(r=>server.once('exit',r));rmSync(dir,{recursive:true,force:true});}
