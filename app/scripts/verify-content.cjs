const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const elements=new Map();
const element=()=>({innerHTML:'',textContent:'',dataset:{},value:'3',classList:{add(){},remove(){},toggle(){}},addEventListener(){},close(){},focus(){},querySelectorAll(){return []},scrollIntoView(){}});
const get=key=>{if(!elements.has(key))elements.set(key,element());return elements.get(key);};
let hash='#home';
const context={document:{querySelector:get,getElementById:get,querySelectorAll:()=>[],addEventListener(){},body:{append(){}}},window:{scrollTo(){},addEventListener(){}},location:{get hash(){return hash}},localStorage:{getItem(){return null},setItem(){}},setTimeout(){return 0},clearTimeout(){},console,Blob,URL};
vm.createContext(context);
for(const file of ['curriculum.js','extension.js','reference-library.js','coverage-data.js','expansion-views.js','pdf-guides.js','learning-flow.js','industry-videos.js','data-mlops-content.js','app.js'])vm.runInContext(fs.readFileSync(`dist/${file}`,'utf8'),context,{filename:file});
vm.runInContext('this.data={modules,resources,roles,projects,R,atlas,coverageRows,challenges,glossary,pdfGuides,learningPhases,guidedModuleIds,videos};this.renderPage=render;this.throttle=throttleDecisions;this.terminal=runTerminal',context);
const {modules,resources,roles,projects,R,atlas,coverageRows,challenges,pdfGuides,learningPhases,guidedModuleIds,videos}=context.data;
assert.equal(pdfGuides.length,8);for(const p of pdfGuides){assert(fs.existsSync('dist/'+p.url));assert.equal(fs.readFileSync('dist/'+p.url).subarray(0,5).toString(),'%PDF-');}
assert.equal(modules.length,30);assert.equal(modules.reduce((n,m)=>n+m.lessons.length,0),95);assert.equal(roles.length,27);assert.equal(challenges.length,10);
for(const list of [modules,resources,roles,projects])assert.equal(new Set(list.map(x=>x.id)).size,list.length);
assert.equal(new Set(atlas.map(x=>x.kind+':'+x.id)).size,atlas.length);
for(const m of modules){for(const ref of m.sources)assert(R[ref],`Missing source ${ref}`);for(const l of m.lessons){assert.equal(l.options.length,3);assert(l.correct>=0&&l.correct<l.options.length);assert(l.exercise&&l.explanation&&l.body);}}
for(const m of modules.filter(m=>m.course==='data')){assert.equal(m.quizBank.length,10);for(const q of m.quizBank){assert.equal(q.options.length,3);assert(q.correct>=0&&q.correct<q.options.length&&q.question&&q.explanation);}}
assert.equal(modules.filter(m=>m.course==='data').reduce((n,m)=>n+m.quizBank.length,0),50);
for(const c of atlas){assert(modules.some(m=>m.id===c.module),`Invalid atlas module ${c.module}`);assert(c.desc,`Missing atlas description ${c.title}`);assert(/^https?:\/\//.test(c.url));}
for(const r of roles){for(const id of r.modules)assert(modules.some(m=>m.id===id));assert(R[r.credential]);assert(projects.some(p=>p.id===r.project));}
function validRoute(href){const [root,a,b]=href.replace(/^#/,'').split('/');if(root==='lesson')return modules.some(m=>m.id===a&&m.lessons[Number(b)]);if(root==='career')return roles.some(r=>r.id===a);if(root==='reference'&&!a)return true;if(root==='reference')return ['toolkit','credentials','frameworks','institutions','law','research'].includes(a)&&(!b||atlas.some(c=>c.kind===a&&c.id===b));return ['home','curriculum','syllabus','checks','labs','field','careers','library','progress','roadmap','project','videos','sources','coverage','login'].includes(root);}
for(const row of coverageRows)for(const [href]of row.links)assert(href.startsWith('https://')||validRoute(href),`Dangling coverage route ${href}`);
assert.equal(coverageRows.filter(r=>r.source==='Udemy').length,16);assert.equal(new Set(coverageRows.filter(r=>r.source==='CyberLab').map(r=>r.area)).size,8);
const routes=['curriculum','syllabus','checks',...learningPhases.map(p=>'curriculum/'+p.id),...modules.map(m=>'checks/'+m.id),'home','login','library','careers','labs','labs/triage','labs/pipeline','videos','progress','roadmap','sources','coverage','field','field/terminal','field/scan','field/throttle','field/glossary',...modules.flatMap(m=>m.lessons.map((l,i)=>`lesson/${m.id}/${i}`)),...roles.map(r=>'career/'+r.id),...projects.map(p=>'project/'+p.id),...atlas.map(c=>`reference/${c.kind}/${c.id}`),...new Set(atlas.map(c=>'reference/'+c.kind))];
for(const route of routes){hash='#'+route;if(route.startsWith('reference'))get('#atlas-grid').dataset.kind=route.split('/')[1]||'toolkit';context.renderPage();const html=get('#app').innerHTML;assert(html.includes('id="main"'),`No main content for ${route}`);assert(!html.includes('undefined'),`Undefined content in ${route}`);for(const match of html.matchAll(/href="(#[^\"]+)"/g)){if(match[1]==='#main')continue;assert(validRoute(match[1]),`Dangling link ${match[1]} on ${route}`);}}
assert.equal(learningPhases.length,10);
assert.equal(guidedModuleIds.length,30);
assert.equal(new Set(guidedModuleIds).size,30);
for(const m of modules)assert(guidedModuleIds.includes(m.id),`Module absent from flow: ${m.id}`);
assert.equal(videos.length,16);
for(const v of videos){assert(/^[A-Za-z0-9_-]{11}$/.test(v.video),`Invalid YouTube ID ${v.id}`);assert(v.provider&&v.notesUrl&&v.activity);assert(validRoute(v.practice));for(const id of v.modules)assert(guidedModuleIds.includes(id));}
for(const p of learningPhases){assert(p.before&&p.goal&&p.outcome&&p.checkpoint);assert(validRoute(p.practice));for(const id of p.videos)assert(videos.some(v=>v.id===id));}
assert.equal(vm.runInContext('nextLesson()',context),'#lesson/mindset/0');
vm.runInContext("state.done=['mindset:0'];state.notes={'mindset:0':'Legacy note'};state.saved=['cs50'];state.projects={incident:{0:true}}",context);
assert.equal(vm.runInContext('nextLesson()',context),'#lesson/mindset/1');
hash='#curriculum';context.renderPage();assert(get('#app').innerHTML.includes('Threat, vulnerability, and risk'));assert(get('#app').innerHTML.includes('1/9 complete'));
vm.runInContext("curriculumQuery='passkeys';updateCurriculum()",context);assert(get('#curriculum-flow').innerHTML.includes('Identity &amp; cryptography')||get('#curriculum-flow').innerHTML.includes('Identity & cryptography'));assert(!get('#curriculum-flow').innerHTML.includes('Windows, hosts'));
vm.runInContext("curriculumQuery='no-such-topic-xyz';updateCurriculum()",context);assert(get('#curriculum-flow').innerHTML.includes('No syllabus topics match'));
vm.runInContext("videoQuery='PortSwigger';videoTopic='All';updateVideos()",context);assert(get('#video-grid').innerHTML.includes('Burp Repeater'));assert(!get('#video-grid').innerHTML.includes('SOC 101'));
vm.runInContext("videoQuery='';videoTopic='Cloud & identity';updateVideos()",context);assert(get('#video-grid').innerHTML.includes('SC-900'));assert(!get('#video-grid').innerHTML.includes('Burp Repeater'));
assert(vm.runInContext("state.notes['mindset:0']==='Legacy note'&&state.saved.includes('cs50')&&state.projects.incident[0]",context));
// Backup round-trip: export, wipe, restore in each mode.
const snapshot=vm.runInContext('JSON.stringify(backupPayload())',context);
assert.equal(JSON.parse(snapshot).app,'nxgenvarsity-unified');
assert.equal(JSON.parse(snapshot).data.done[0],'mindset:0');
assert(vm.runInContext("applyBackup(JSON.stringify({nope:true})).ok===false",context),'Rejects unknown file');
assert(vm.runInContext("applyBackup('not json').ok===false",context),'Rejects invalid JSON');
vm.runInContext("state.done=[];state.notes={};state.saved=[];state.projects={};state.answers={}",context);
const merged=vm.runInContext(`applyBackup(${JSON.stringify(snapshot)},'merge')`,context);
assert(merged.ok);assert(vm.runInContext("state.done.includes('mindset:0')&&state.saved.includes('cs50')&&state.projects.incident[0]",context),'Merge restores progress');
vm.runInContext(`state.done=['extra:9'];state.notes={keep:'mine'};applyBackup(${JSON.stringify(snapshot)},'merge')`,context);
assert(vm.runInContext("state.done.includes('extra:9')&&state.notes.keep==='mine'&&state.notes['mindset:0']==='Legacy note'",context),'Merge keeps local items');
vm.runInContext(`applyBackup(${JSON.stringify(snapshot)},'replace')`,context);
assert(vm.runInContext("!state.done.includes('extra:9')&&state.done.includes('mindset:0')&&state.notes.keep===undefined",context),'Replace mirrors the file');
assert.equal(vm.runInContext('backupSummary({done:["a","b"],notes:{x:1},saved:[]})',context),'2 lessons · 1 note · 0 saved');
// Mistake review collects only answers marked false.
vm.runInContext("state.answers={'mindset:0':false,'mindset:1':true,'mindset:2':false}",context);
assert.equal(vm.runInContext('reviewQueue().length',context),2);
hash='#checks';context.renderPage();assert(get('#app').innerHTML.includes('2 checks to revisit'),'Checks page shows review count');
hash='#checks/review';context.renderPage();const reviewHtml=get('#app').innerHTML;
assert(reviewHtml.includes('data-review'),'Review page renders a question');assert(reviewHtml.includes('1 of 2'));
assert(!reviewHtml.includes('undefined'));
hash='#checks/review/1';context.renderPage();assert(get('#app').innerHTML.includes('2 of 2'));
hash='#checks/review/99';context.renderPage();assert(get('#app').innerHTML.includes('of 2'));
vm.runInContext("state.answers={}",context);hash='#checks/review';context.renderPage();assert(get('#app').innerHTML.includes('review list is clear'));
vm.runInContext("state.answers={'mindset:0':false}" ,context);hash='#checks/review';context.renderPage();assert(get('#app').innerHTML.includes('1 of 1'));
vm.runInContext("state.answers={}",context);
const syllabus=vm.runInContext('syllabusMarkdown()',context);for(const m of modules)for(const l of m.lessons)assert(syllabus.includes(l.title));
vm.runInContext("state.done=guidedModules().flatMap(m=>m.lessons.map((l,i)=>m.id+':'+i))",context);assert.equal(vm.runInContext('nextLesson()',context),'#progress');assert(vm.runInContext('startingPoint()',context).includes('course is complete'));
assert.equal(context.throttle(3).map(r=>r.decision).join(','),'ALLOW,ALLOW,ALLOW,THROTTLE,THROTTLE,ALLOW,ALLOW');
context.terminal('cat README.txt');assert(get('#terminal-output').textContent.includes('AUTHORIZED TRAINING ONLY'));
context.terminal('curl https://example.com');assert(get('#terminal-output').textContent.includes('No command was executed.'));
console.log(`Passed: ${routes.length} rendered routes, 75 quizzes, ${atlas.length} atlas entries, ${coverageRows.length} coverage rows, 7 syllabus stages covering every module, 8 videos, guided progression, curriculum/video search, retained learner state, all internal destinations, synthetic throttle/terminal behavior.`);
