(function (root) {
  "use strict";
  const VERSION = 1;
  function numeric(value) {
    const raw = String(value == null ? "" : value).trim().replace(",", ".");
    return raw !== "" && /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : NaN;
  }
  function isCorrect(task, value) {
    if (task.type === "choice") return value !== null && value !== "" && Number(value) === task.answer;
    if (task.type === "number") return Number.isFinite(numeric(value)) && Math.abs(numeric(value) - task.answer) < 0.000001;
    if (task.type === "order") return Array.isArray(value) && value.length === task.items.length && value.every((v,i) => v === i);
    if (task.type === "match") return Array.isArray(value) && value.length === task.pairs.length && value.every((v,i) => String(v) === String(i));
    if (task.type === "builder") return value && Object.entries(task.answer).every(([k,v]) => numeric(value[k]) === v);
    return false;
  }
  function attempt(previous, correct, answer) {
    const old = previous || { tries: 0, hints: 0 };
    return { ...old, tries: old.tries + 1, firstCorrect: old.tries ? old.firstCorrect : correct, correct, answer };
  }
  function shuffle(values, random = Math.random) {
    const result = values.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    if (result.length > 1 && result.every((v,i) => v === values[i])) result.push(result.shift());
    return result;
  }
  function cleanRecord(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw Error("El progreso de una misión no es válido.");
    const route = ["steady","guided","challenge"].includes(value.route) ? value.route : "steady";
    const result = { route, step: Number.isInteger(value.step) ? Math.max(0,Math.min(value.step,30)) : 0, attempts: {}, project: {} };
    if (value.attempts && typeof value.attempts === "object") {
      for (const [key, a] of Object.entries(value.attempts)) {
        if (!/^\d{1,2}$/.test(key) || !a || typeof a !== "object") throw Error("Los intentos importados no son válidos.");
        result.attempts[key] = {
          tries: Math.max(0,Math.min(Number(a.tries) || 0,999)),
          hints: Math.max(0,Math.min(Number(a.hints) || 0,999)),
          firstCorrect: typeof a.firstCorrect === "boolean" ? a.firstCorrect : null,
          correct: a.correct === true, skipped: a.skipped === true
        };
      }
    }
    const p = value.project && typeof value.project === "object" ? value.project : {};
    const text = String(p.text || "");
    const note = String(p.teacherNote || "");
    if (text.length > 12000 || note.length > 3000) throw Error("El texto importado es demasiado largo.");
    result.project = { text, alternative: p.alternative === true, checks: Array.isArray(p.checks) ? p.checks.slice(0,10).map(Boolean) : [], saved: p.saved === true, teacherState: ["pending","conceptual-support","independent"].includes(p.teacherState) ? p.teacherState : "pending", teacherNote: note };
    if (typeof value.finishedAt === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value.finishedAt)) result.finishedAt = value.finishedAt.slice(0,40);
    return result;
  }
  function parseImport(text, allowedIds) {
    if (typeof text !== "string" || text.length > 1000000) throw Error("El archivo supera el tamaño permitido.");
    let raw;
    try { raw = JSON.parse(text); } catch (_) { throw Error("No es un archivo JSON válido."); }
    if (!raw || raw.schemaVersion !== VERSION || !raw.records || typeof raw.records !== "object" || Array.isArray(raw.records)) throw Error("Este archivo no corresponde a una mochila de la Noria.");
    const result = { schemaVersion: VERSION, nickname: typeof raw.nickname === "string" ? raw.nickname.slice(0,60) : "Explorador curioso", records: {} };
    const entries = Object.entries(raw.records);
    if (entries.length > 200) throw Error("El archivo contiene demasiadas misiones.");
    for (const [id, record] of entries) {
      if (!allowedIds.has(id)) throw Error("Hay una misión que no pertenece a esta entrega: " + id);
      result.records[id] = cleanRecord(record);
    }
    return result;
  }
  function csvCell(value) {
    let text = String(value == null ? "" : value);
    if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g,'""') + '"';
  }
  function csv(records) {
    const lines = [["Misión","Recorrido","Primeros aciertos","Intentos","Pistas","Evidencia docente","Creación guardada"]];
    for (const [id,r] of Object.entries(records)) {
      const a = Object.values(r.attempts || {});
      lines.push([id,r.route,a.filter(x=>x.firstCorrect).length,a.reduce((n,x)=>n+(x.tries||0),0),a.reduce((n,x)=>n+(x.hints||0),0),r.project?.teacherState||"pending",r.project?.saved ? "Sí" : "No"]);
    }
    return "\ufeff" + lines.map(row=>row.map(csvCell).join(",")).join("\r\n");
  }
  const api = { VERSION, numeric, isCorrect, attempt, shuffle, parseImport, cleanRecord, csvCell, csv };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NoriaCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);


;
(function () {
  'use strict';
  const C = window.NORIA_CONFIG, core = window.NoriaCore, app = document.getElementById('app');
  const prefix = 'noria-tercero:v1:', names = ['Nori','Sira','Plumi','Lumo'];
  const memory = new Map();let volatileStorage=false;
  function storage(kind) { try { return window[kind]; } catch (_) { volatileStorage=true;return {getItem:k=>memory.get(kind+k)||null,setItem:(k,v)=>memory.set(kind+k,v),removeItem:k=>memory.delete(kind+k)}; } }
  const local = storage('localStorage'), session = storage('sessionStorage');
  const ids = new Set(Array.from({length:16},(_,i)=>String(i+1).padStart(2,'0')).flatMap(n=>['MAT-T1-S'+n,'LCL-T1-S'+n]));
  let selected = null, profile, storageWarning = volatileStorage?'El almacenamiento está bloqueado. Descarga tu mochila antes de cerrar o cambiar de página.':'', currentStep = 0;
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k,v] of Object.entries(attrs || {})) {
      if (k.startsWith('on')) node.addEventListener(k.slice(2).toLowerCase(),v);
      else if (k === 'class') node.className=v;
      else if (k === 'value') node.value=v;
      else if (k === 'checked') node.checked=v;
      else if (v !== false && v != null) node.setAttribute(k,v === true ? '' : v);
    }
    for (const child of children.flat(Infinity)) if (child != null) node.append(child instanceof Node ? child : document.createTextNode(String(child)));
    return node;
  }
  const button = (text,action,cls='')=>el('button',{type:'button',class:cls,onClick:action},text);
  const link = (text,url,cls='button')=>el('a',{href:url,class:cls,...(cls.includes('download-link')?{download:''}:{})},text);
  const sprite = (name,pose=0,small=false)=>el('span',{class:`sprite ${name} pose-${pose}${small?' small':''}`,role:'img','aria-label':name[0].toUpperCase()+name.slice(1)});
  function read(store,key,fallback) { try { return JSON.parse(store.getItem(prefix+key)) || fallback; } catch (_) { storageWarning='El navegador no permite guardar aquí. Puedes seguir jugando y descargar tu mochila.'; return fallback; } }
  function write(store,key,value) { try { store.setItem(prefix+key,JSON.stringify(value)); } catch (_) { storageWarning='No se ha podido guardar en este navegador. Descarga tu mochila para conservarla.'; } }
  function empty(nickname='Invitado') { return {schemaVersion:1,nickname,records:{}}; }
  try { selected = session.getItem(prefix+'selected'); } catch (_) {}
  profile = selected ? read(local,'profile:'+selected,empty()) : read(session,'guest',empty());
  function persist() { write(selected?local:session,selected?'profile:'+selected:'guest',profile); }
  function setProfile(id,data) { selected=id; profile=data; try { if(id)session.setItem(prefix+'selected',id);else session.removeItem(prefix+'selected'); } catch (_){} persist(); render(); }
  function record() { const id=C.mission.id; if(!profile.records[id])profile.records[id]={route:'steady',step:0,attempts:{},project:{text:'',checks:[],teacherState:'pending'}}; return profile.records[id]; }
  function saveRecord() { record().step=currentStep; persist(); }
  function announce(text,target) { target.textContent=text; }
  function dialog(title,content) {
    const d=el('dialog',{},el('h2',{},title),...content,button('Cerrar',()=>d.close()));
    document.body.append(d);d.addEventListener('close',()=>d.remove());d.showModal();return d;
  }
  function download(text,name,type='application/json') { const url=URL.createObjectURL(new Blob([text],{type}));const a=el('a',{href:url,download:name});document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000); }
  function backpack() {
    const status=el('p',{role:'status'});
    const input=el('input',{type:'file',accept:'.json,application/json',onChange:async()=>{
      try {
        const file=input.files[0];if(!file)return;if(file.size>1000000)throw Error('El archivo es demasiado grande.');
        const data=core.parseImport(await file.text(),ids);
        dialog('Incorporar mochila',[el('p',{},'Se añadirán las misiones importadas. Las que coincidan sustituirán su progreso actual en este perfil.'),button('Incorporar estas misiones',()=>{Object.assign(profile.records,data.records);persist();document.querySelectorAll('dialog').forEach(d=>d.close());render();},'primary')]);
      } catch(e) { announce(e.message,status); }
    }});
    dialog('Tu mochila de descubrimientos',[
      el('p',{},'Perfil: '+profile.nickname+'. El progreso se guarda solo en este navegador. No se envía a un servidor ni se comparte automáticamente con otra tablet.'),
      el('div',{class:'row'},button('Descargar JSON',()=>download(JSON.stringify(profile,null,2),'mochila-noria.json')),button('Descargar resumen CSV',()=>download(core.csv(profile.records),'resumen-noria.csv','text/csv;charset=utf-8'))),
      el('label',{},'Importar una mochila JSON',input),status,
      el('p',{class:'quiet'},'Guarda el archivo en un lugar privado. Puede contener creaciones y observaciones del docente; no lo subas al repositorio público.'),
      button('Borrar progreso de este perfil',()=>dialog('Borrar este progreso',[el('p',{},'Se vaciará la mochila del perfil actual en este navegador. Puedes descargarla primero.'),button('Borrar esta mochila',()=>{profile.records={};persist();document.querySelectorAll('dialog').forEach(d=>d.close());render();})]))
    ]);
  }
  function profiles() {
    const profiles=read(local,'profiles',[]);
    const list=el('div',{class:'options'},button('Jugar como invitado',()=>{document.querySelector('dialog').close();setProfile(null,read(session,'guest',empty()));}));
    profiles.forEach(p=>list.append(button(p.name,()=>{document.querySelector('dialog').close();setProfile(p.id,read(local,'profile:'+p.id,empty(p.name)));})));
    list.append(button('Crear apodo positivo',()=>{
      const id=Date.now().toString(36)+Math.random().toString(36).slice(2,6), name=['Roble paciente','Cometa amable','Lince curioso','Estrella creativa','Delfín atento'][Math.floor(Math.random()*5)]+' '+(profiles.length+1);
      profiles.push({id,name});write(local,'profiles',profiles);document.querySelector('dialog').close();setProfile(id,empty(name));
    },'primary'));
    dialog('¿Quién explora hoy?',[el('p',{},'Elige tu apodo al usar una tablet compartida. No escribas nombres reales. Invitado conserva la sesión de esta pestaña.'),list]);
  }
  function header(main) {
    app.replaceChildren(el('a',{class:'skip',href:'#contenido'},'Saltar al contenido'),el('header',{},C.home?link('◉ La Noria',C.home,'brand'):el('span',{class:'brand'},'◉ La Noria'),el('nav',{'aria-label':'Herramientas'},button(profile.nickname,profiles),button('Mochila',backpack),button('Proyector',()=>document.body.classList.toggle('projector')))),main,
      el('footer',{},'La Noria de los Descubrimientos · 3.º de Primaria · Material original. Sin cuentas infantiles ni anuncios. ',button('Guía y créditos',credits)));
    if(storageWarning)main.prepend(el('p',{role:'status',class:'notice'},storageWarning));
  }
  function credits() {
    dialog('Para acompañar la aventura',[
      el('p',{},'Propuesta para 3.º del CEIP Maestro Francisco Martínez Bernal, Molina de Segura. Matemáticas y Lengua: 16 misiones por área. La secuencia es una propuesta propia pendiente de cotejar con la programación y los índices del Libro 1 de EMAT y Superletras.'),
      el('p',{},'Sin límite de tiempo. Usa pistas, teclado, lectura acompañada o respuesta oral cuando sea adecuado al objetivo. Las adaptaciones de acceso se registran aparte del apoyo para resolver el contenido. El docente observa las creaciones; el juego no las califica.'),
      el('p',{},'Proyector amplía la vista para turnos en una pantalla. Cada navegador mantiene su propia mochila; no hay sincronización entre dispositivos. Los HTML descargables incluyen todos los recursos y funcionan sin conexión.'),
      el('p',{},'Personajes Nori, Sira, Plumi y Lumo: ilustraciones originales generadas con IA para este proyecto. Textos, actividades y gráficos originales. Los libros citados sirven como referencia: no se reproducen sus ilustraciones ni ejercicios. No se incorpora contenido de las fotos de los libros.'),
      el('p',{},'Referencia curricular: Decreto 209/2022 de la Región de Murcia, segundo ciclo de Primaria. La distribución por semanas no es una secuencia oficial.'),
      el('a',{href:'https://www.borm.es/services/anuncio/ano/2022/numero/5907/pdf',target:'_blank',rel:'noopener'},'Consultar currículo oficial'),
      el('p',{class:'quiet'},'La licencia de redistribución del proyecto queda pendiente de decisión de su titular. Sin analítica añadida; el proveedor del alojamiento puede conservar registros técnicos. El audio solo se ofrece si el dispositivo dispone de una voz local en español.')
    ]);
  }
  function catalog() {
    const main=el('main',{id:'contenido'}), guideNames=['nori','sira','plumi','lumo'];
    main.append(el('section',{class:'hero'},el('div',{},el('span',{class:'eyebrow'},'3.º de Primaria · Primer trimestre'),el('h1',{},'Cada semana, un nuevo descubrimiento.'),el('p',{},'Lee, construye y encuentra tu manera de resolver. Nori, Sira, Plumi y Lumo te acompañan.'),link('Elegir una misión','#misiones','button primary')),el('div',{class:'cast'},guideNames.map((n,i)=>el('figure',{},sprite(n,i),el('figcaption',{},names[i]))))));
    main.append(el('div',{class:'stats'},el('div',{},el('strong',{},'32'),el('span',{},'misiones para explorar')),el('div',{},el('strong',{},'16'),el('span',{},'semanas por asignatura')),el('div',{},el('strong',{},'A tu ritmo'),el('span',{},'con pistas y sin reloj'))));
    const grid=el('div',{class:'grid'}),count=el('p',{class:'quiet',role:'status'});
    const subject=el('select',{},el('option',{value:''},'Todas las asignaturas'),el('option',{value:'matematicas'},'Matemáticas'),el('option',{value:'lengua'},'Lengua'));
    const week=el('select',{},el('option',{value:''},'Todas las semanas'),Array.from({length:16},(_,i)=>el('option',{value:i+1},'Semana '+(i+1))));
    const search=el('input',{type:'search',placeholder:'Busca un descubrimiento'});
    function update() {
      const list=C.missions.filter(m=>(!subject.value||m.slug===subject.value)&&(!week.value||m.week===Number(week.value))&&(!search.value||(m.title+' '+m.goal).toLocaleLowerCase('es').includes(search.value.toLocaleLowerCase('es'))));
      grid.replaceChildren(...list.map(m=>el('article',{class:'card '+m.slug},el('span',{class:'tag'},m.subjectTitle+' · Semana '+m.week),el('h3',{},m.title),el('p',{},m.goal),el('p',{class:'quiet'},profile.records[m.id]?.finishedAt?'Recorrida · Puedes volver a revisarla':m.duration||'Explora y crea a tu ritmo'),el('div',{class:'row'},link('Explorar',m.url,'button primary'),link('HTML sin conexión',m.download,'button download-link')))));
      if(!list.length)grid.append(el('p',{class:'empty'},'No hay misiones con estos filtros. Prueba otra búsqueda.'));count.textContent=list.length+' misiones disponibles.';
    }
    [subject,week].forEach(n=>n.addEventListener('change',update));search.addEventListener('input',update);
    main.append(el('section',{id:'misiones'},el('h2',{},'Elige tu próximo descubrimiento'),el('div',{class:'filters'},el('label',{},'Asignatura',subject),el('label',{},'Semana',week),el('label',{},'Buscar',search)),count,grid),el('details',{},el('summary',{},'Una propuesta para todo el trimestre'),el('p',{},'Las otras asignaturas tienen sus especificaciones semanales preparadas. Aquí aparecen las actividades ya implementadas de Matemáticas y Lengua. Puedes abrir cualquier semana: no hay bloqueos por fecha.')));
    update();header(main);
  }
  function visual(v) {
    const box=el('div',{class:'visual'}); if(!v)return box;
    const svg=(children,label,viewBox='0 0 400 160')=>{const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox',viewBox);s.setAttribute('role','img');s.setAttribute('aria-label',label);children.forEach(([tag,attrs,text])=>{const n=document.createElementNS(s.namespaceURI,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,v));if(text)n.textContent=text;s.append(n);});return s;};
    if(v.kind==='blocks') { const value=Number(v.value),h=Math.floor(value/100),t=Math.floor(value%100/10),u=value%10;box.append(el('p',{class:'quiet'},`${h} centenas, ${t} decenas y ${u} unidades`),el('div',{class:'blocks','aria-hidden':'true'},Array.from({length:h},()=>el('span',{class:'block hundred'})),Array.from({length:t},()=>el('span',{class:'block ten'})),Array.from({length:u},()=>el('span',{class:'block'},'1')))); }
    if(v.kind==='array')box.append(el('p',{},`${v.rows} filas de ${v.cols} puntos`),el('div',{class:'dots','aria-hidden':'true'},Array.from({length:v.rows},()=> '●'.repeat(v.cols)).join('\n')));
    if(v.kind==='coins')box.append(el('div',{class:'coins'},v.values.map(n=>el('span',{class:'coin'},n+' €'))));
    if(v.kind==='bars')box.append(el('div',{class:'bars'},v.labels.map((l,i)=>el('div',{class:'bar-line'},el('span',{},l),el('div',{class:'bar',style:'width:'+Math.max(15,v.values[i]/Math.max(...v.values)*100)+'%'},v.values[i])))));
    if(v.kind==='shape'){const points={triangle:'200,15 65,140 335,140',square:'130,15 270,15 270,155 130,155',rectangle:'55,30 345,30 345,130 55,130'};box.append(svg([['polygon',{points:points[v.shape],fill:'#d9e8be',stroke:'#225d50','stroke-width':4}]],{triangle:'Triángulo con tres lados rectos',square:'Cuadrado con cuatro lados iguales',rectangle:'Rectángulo con cuatro lados y cuatro ángulos rectos'}[v.shape]));}
    if(v.kind==='numberline'||v.kind==='ruler'){const start=v.start||0,end=v.end||v.max,step=v.step||1,children=[['line',{x1:20,y1:65,x2:380,y2:65,stroke:'#225d50','stroke-width':3}]];for(let n=start;n<=end;n+=step){const x=20+(n-start)/(end-start)*360;children.push(['line',{x1:x,y1:55,x2:x,y2:75,stroke:'#225d50'}],['text',{x,y:100,'text-anchor':'middle',fill:'#173f38','font-size':14},String(n)]);}if(v.kind==='ruler')children.push(['line',{x1:20,y1:35,x2:20+v.value/end*360,y2:35,stroke:'#ae4221','stroke-width':12}]);if(v.point!=null){const x=20+(v.point-start)/(end-start)*360;children.push(['circle',{cx:x,cy:65,r:7,fill:'#ae4221'}]);}box.append(svg(children,v.kind==='ruler'?`Regla de 0 a ${end} cm. El objeto empieza en cero y termina en ${v.value} cm.`:`Recta de ${start} a ${end}, de ${step} en ${step}${v.point!=null?'. Punto marcado en '+v.point:''}.`));}
    if(v.kind==='clock'){const children=[['circle',{cx:100,cy:100,r:90,fill:'#fffdf8',stroke:'#225d50','stroke-width':4}]];for(let n=1;n<=12;n++){let a=n*Math.PI/6;children.push(['text',{x:100+72*Math.sin(a),y:106-72*Math.cos(a),'text-anchor':'middle',fill:'#173f38','font-size':17},String(n)]);}[[v.hour%12*Math.PI/6+v.minute*Math.PI/360,46,6],[v.minute*Math.PI/30,64,4]].forEach(([a,l,w])=>children.push(['line',{x1:100,y1:100,x2:100+l*Math.sin(a),y2:100-l*Math.cos(a),stroke:'#225d50','stroke-width':w}]));box.append(svg(children,`Reloj: ${v.hour}:${String(v.minute).padStart(2,'0')}`,'0 0 200 200'));box.style.maxWidth='260px';}
    return box;
  }
  function audio(text) {
    if(!('speechSynthesis'in window))return el('p',{class:'quiet'},'Puedes leer el texto o pedir una lectura acompañada.');
    const status=el('span',{class:'quiet',role:'status'});
    return el('div',{class:'row'},button('Escuchar texto',()=>{
      const voice=speechSynthesis.getVoices().find(v=>v.localService&&v.lang.startsWith('es'));
      if(!voice){status.textContent='No hay una voz local en español. El texto permanece disponible para leerlo.';return;}
      speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='es-ES';u.voice=voice;u.rate=.88;speechSynthesis.speak(u);status.textContent='Lectura en curso.';
    }),button('Parar lectura',()=>{speechSynthesis.cancel();status.textContent='Lectura detenida.';}),status);
  }
  function mission() {
    const m=C.mission,r=record();currentStep=Math.min(r.step||0,(r.route==='guided'&&m.supportTasks?m.supportTasks:m.tasks).length+1);
    const tasks=r.route==='guided'&&m.supportTasks?m.supportTasks:m.tasks;
    const main=el('main',{id:'contenido'}),work=el('section',{class:'panel task','aria-label':'Actividad actual'});
    const side=el('aside',{},el('div',{class:'panel'},el('h2',{},'Tu recorrido'),el('p',{class:'quiet'},'Sin reloj. Puedes volver, usar pistas y revisar.'),el('progress',{max:tasks.length+1,value:Object.values(r.attempts).filter(a=>a.correct).length+(r.project.saved?1:0),'aria-label':'Actividades resueltas y creación guardada'}),el('p',{class:'quiet'},'La creación final se comparte con el docente.'),C.download?link('Descargar este HTML',C.download,'button download-link'):el('p',{class:'quiet'},'Estás en la versión sin conexión. Guarda este archivo para volver a jugar.')));
    const route=el('select',{},el('option',{value:'steady'},'A mi ritmo'),el('option',{value:'guided'},'Con pistas'),el('option',{value:'challenge'},'Con un reto más'));route.value=r.route;
    route.addEventListener('change',()=>{const desired=route.value;dialog('Cambiar recorrido',[el('p',{},'Las actividades pueden cambiar. Se reiniciarán los intentos de esta misión; tu creación se conserva. Descarga la mochila antes si quieres guardar ambos recorridos.'),button('Cambiar a este recorrido',()=>{r.route=desired;r.step=0;r.attempts={};delete r.finishedAt;persist();document.querySelector('dialog').close();render();},'primary')]);route.value=r.route;});
    const stepbar=el('nav',{class:'stepbar','aria-label':'Pasos de la misión'},tasks.map((t,i)=>button(String(i+1),()=>go(i))),button('Crear',()=>go(tasks.length)),button('Ver resumen',()=>go(tasks.length+1)));
    main.append(el('div',{class:'mission-head'},el('span',{class:'eyebrow'},(C.subjectTitle||'')+' · Semana '+m.week+' · '+m.id),el('h1',{},m.title),el('p',{},m.goal)),el('div',{class:'guide'},sprite(m.guide||'nori',1,true),el('p',{},m.intro)),el('label',{},'Elige cómo explorar ',route));
    if(m.story)main.append(el('details',{class:'panel',open:true},el('summary',{},'El texto de esta misión'),el('p',{class:'story'},m.story),audio(m.story)));
    main.append(stepbar,el('div',{class:'mission-layout'},work,side),el('details',{},el('summary',{},'Orientaciones para acompañar'),el('p',{},'Criterios de segundo ciclo: '+m.criteria.join(', ')+'. Propuesta semanal propia; cotejar con la programación de aula.'),el('p',{},m.alignmentStatus||'Secuencia propuesta, pendiente de cotejar el índice y la programación del Libro 1.'),el('p',{},'Lectura acompañada, teclado y respuesta alternativa no restan puntos. Registra el apoyo para resolver el contenido por separado. Las tareas no son una calificación global.'),el('p',{},m.project.teacherNotes)));
    header(main);
    function go(index) { currentStep=index;saveRecord();paint();work.scrollIntoView({behavior:'auto',block:'start'});const heading=work.querySelector('h2');heading?.focus(); }
    function paint() {
      stepbar.querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-current',i===currentStep?'step':'false');b.setAttribute('aria-pressed',String(i===currentStep));});
      work.replaceChildren();
      if(currentStep===tasks.length){project();return;}
      if(currentStep>tasks.length){summary();return;}
      const t=tasks[currentStep],index=currentStep,old=r.attempts[index];let answer=old?.answer??null;
      work.append(el('span',{class:'tag'},'Actividad '+(index+1)+' de '+tasks.length),el('h2',{tabindex:'-1'},t.prompt));
      if(t.visual)work.append(visual(t.visual));
      const entry=el('div',{}),feedback=el('div',{role:'status','aria-live':'polite'}),hint=el('div',{});
      if(t.type==='choice'){
        const options=t.options.map((text,i)=>button(text,()=>{answer=i;options.forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));}));options.forEach((b,i)=>b.setAttribute('aria-pressed',String(answer===i)));entry.append(el('div',{class:'options'},options));
      }
      if(t.type==='number'){const input=el('input',{type:'text',inputmode:'decimal',value:answer??'',onInput:()=>answer=input.value});entry.append(el('label',{},'Tu respuesta'+(t.unit?' ('+t.unit+')':''),input));}
      if(t.type==='order'){
        answer=Array.isArray(answer)?answer.slice():core.shuffle(t.items.map((_,i)=>i));const list=el('ol',{class:'order-list'});
        function redraw(focusIndex,up){list.replaceChildren(...answer.map((item,i)=>el('li',{},el('span',{},t.items[item]),el('button',{type:'button',disabled:i===0,'aria-label':'Subir '+t.items[item],onClick:()=>{[answer[i-1],answer[i]]=[answer[i],answer[i-1]];redraw(i-1,true);}},'↑'),el('button',{type:'button',disabled:i===answer.length-1,'aria-label':'Bajar '+t.items[item],onClick:()=>{[answer[i+1],answer[i]]=[answer[i],answer[i+1]];redraw(i+1,false);}},'↓'))));if(focusIndex!=null){const buttons=list.children[focusIndex].querySelectorAll('button');(buttons[up?0:1].disabled?buttons[up?1:0]:buttons[up?0:1]).focus();}}
        redraw();entry.append(el('p',{class:'quiet'},'Cambia el orden con las flechas de cada fila. También funcionan con teclado.'),list);
      }
      if(t.type==='match'){
        answer=Array.isArray(answer)?answer.slice():t.pairs.map(()=> '');const order=core.shuffle(t.pairs.map((_,i)=>i));
        t.pairs.forEach(([left],i)=>{const select=el('select',{'aria-label':'Relacionar '+left,onChange:()=>answer[i]=select.value},el('option',{value:''},'Elige una opción'),order.map(j=>el('option',{value:j},t.pairs[j][1])));select.value=answer[i];entry.append(el('label',{class:'match-line'},el('span',{},left),select));});
      }
      if(t.type==='builder'){
        answer=answer&&typeof answer==='object'?{...answer}:Object.fromEntries(Object.keys(t.answer).map(k=>[k,'']));const draw=el('div',{}),fields=el('div',{class:'builder'}),labels={hundreds:'Centenas',tens:'Decenas',ones:'Unidades',rows:t.config.rowLabel||'Filas',cols:t.config.colLabel||'En cada fila'};
        function update(){draw.replaceChildren();const vals=Object.values(answer).map(core.numeric),max=t.mode==='placeValue'?9:t.config.max;if(vals.some(n=>!Number.isInteger(n)||n<0||n>max)){draw.append(el('p',{class:'quiet'},'Usa cantidades enteras de 0 a '+max+'.'));return;}let v;if(t.mode==='placeValue'){const n=(core.numeric(answer.hundreds)||0)*100+(core.numeric(answer.tens)||0)*10+(core.numeric(answer.ones)||0);if(n>=0&&n<=999)v={kind:'blocks',value:n};}else{const rows=core.numeric(answer.rows),cols=core.numeric(answer.cols);if(rows>=0&&cols>=0&&rows<=12&&cols<=12)v={kind:'array',rows,cols};}if(v)draw.replaceChildren(visual(v));}
        Object.keys(t.answer).forEach(k=>{const input=el('input',{type:'number',min:0,max:t.mode==='placeValue'?9:t.config.max,value:answer[k],onInput:()=>{answer[k]=input.value;update();}});fields.append(el('label',{},labels[k],input));});entry.append(fields,draw);update();
      }
      function showHint(count=true){hint.replaceChildren(el('p',{class:'hint'},t.hint));if(count){const a=r.attempts[index]||{tries:0,hints:0};a.hints=(a.hints||0)+1;r.attempts[index]=a;saveRecord();}}
      if(r.route==='guided')showHint(false);
      const check=button('Comprobar',()=>{
        const missing=answer===null||answer===''||(Array.isArray(answer)&&answer.some(v=>v===''))||(t.type==='builder'&&Object.values(answer).some(v=>v===''));
        if(missing){feedback.className='feedback error';feedback.textContent='Completa tu respuesta antes de comprobar.';return;}
        const correct=core.isCorrect(t,answer);r.attempts[index]=core.attempt(r.attempts[index],correct,JSON.parse(JSON.stringify(answer)));saveRecord();feedback.className='feedback'+(correct?'':' error');feedback.textContent=correct?'¡Lo has encontrado! '+t.explanation:'Todavía podemos revisarlo. '+t.hint;side.querySelector('progress').value=Object.values(r.attempts).filter(a=>a.correct).length+(r.project.saved?1:0);
      },'primary');
      work.append(entry,el('div',{class:'row'},check,button('Dame una pista',()=>showHint()),button('Leer la consigna',()=>{const d=dialog('Consigna',[el('p',{},t.prompt),audio(t.prompt)]);})),hint,feedback,el('hr'),el('div',{class:'row'},index?button('Anterior',()=>go(index-1)):null,button('Seguir y revisar después',()=>{if(!r.attempts[index]?.correct){r.attempts[index]={...(r.attempts[index]||{tries:0,hints:0}),skipped:true};saveRecord();}go(index+1);})));
      if(old?.correct){feedback.className='feedback';feedback.textContent='Ya resolviste esta actividad. '+t.explanation;}
    }
    function project() {
      const p=m.project,state=r.project;
      work.append(el('span',{class:'tag'},'Tu creación'),el('h2',{tabindex:'-1'},p.title),el('p',{},p.prompt),el('details',{},el('summary',{},'Ver un ejemplo para orientarme'),el('p',{},p.model)));
      if(r.route==='challenge')work.append(el('p',{class:'hint'},'Un reto más: '+p.extension));
      const text=el('textarea',{maxlength:12000,value:state.text||'','aria-label':'Tu creación',onInput:()=>{state.text=text.value;state.saved=false;state.teacherState='pending';if(observation)observation.value='pending';saveRecord();}}),status=el('p',{role:'status'});
      work.append(el('label',{},'Escribe aquí o prepara tu creación fuera de la pantalla.',text));
      const checks=el('div',{class:'checks'},p.checklist.map((s,i)=>{const input=el('input',{type:'checkbox',checked:state.checks?.[i]||false,onChange:()=>{state.checks=state.checks||[];state.checks[i]=input.checked;saveRecord();}});return el('label',{},input,s);}));
      const alternative=el('input',{type:'checkbox',checked:state.alternative||false,onChange:()=>{state.alternative=alternative.checked;state.teacherState='pending';observation.value='pending';saveRecord();}});
      work.append(checks,el('div',{class:'checks'},el('label',{},alternative,'He preparado mi respuesta en papel, de forma oral o con otra modalidad acordada con el docente.')),
        el('div',{class:'row'},button('Guardar mi creación',()=>{if(!state.text?.trim()&&!state.alternative){status.textContent='Escribe tu creación o indica que la has preparado fuera de la pantalla.';return;}state.saved=true;saveRecord();status.textContent='Creación guardada. El docente podrá observarla; todavía no se ha calificado.';},'primary'),button('Ver mi recorrido',()=>go(tasks.length+1))),status);
      const observation=el('select',{},el('option',{value:'pending'},'Pendiente de observar'),el('option',{value:'conceptual-support'},'Observada con apoyo para el contenido'),el('option',{value:'independent'},'Observada sin apoyo para el contenido'));observation.value=state.teacherState||'pending';observation.addEventListener('change',()=>{state.teacherState=observation.value;saveRecord();});
      const note=el('textarea',{maxlength:3000,value:state.teacherNote||'',onInput:()=>{state.teacherNote=note.value;saveRecord();},'aria-label':'Observación del docente'});
      work.append(el('details',{},el('summary',{},'Registro del acompañante'),el('p',{},p.teacherNotes),el('label',{},'Evidencia de la creación',observation),el('label',{},'Modalidad de acceso y observaciones (sin nombres reales)',note),el('p',{class:'quiet'},'La respuesta oral no demuestra por sí sola el logro de un objetivo de escritura. Registrar la modalidad y el objetivo observado. Este registro no está protegido por contraseña.')));
    }
    function summary(){const attempts=Object.values(r.attempts),correct=attempts.filter(a=>a.correct).length;work.append(sprite(m.guide||'nori',3,true),el('h2',{tabindex:'-1'},'Cada paso cuenta'),el('p',{},`${correct} de ${tasks.length} actividades resueltas. ${attempts.filter(a=>a.firstCorrect).length} encontradas en el primer intento.`),el('p',{},`Has comprobado ${attempts.reduce((n,a)=>n+(a.tries||0),0)} veces y pedido ${attempts.reduce((n,a)=>n+(a.hints||0),0)} pistas. Puedes seguir revisando.`),el('p',{},r.project.saved?'Tu creación está guardada.':'Tu creación aún no está guardada.'),el('p',{},'Evidencia docente: '+({'pending':'pendiente de observar','independent':'observada sin apoyo para el contenido','conceptual-support':'observada con apoyo para el contenido'}[r.project.teacherState]||'pendiente de observar')),el('div',{class:'row'},button('Revisar actividades',()=>go(0)),button('Volver a mi creación',()=>go(tasks.length)),button('Guardar recorrido como visitado',()=>{r.finishedAt=new Date().toISOString();saveRecord();status.textContent='Recorrido guardado. Esto no es una calificación.';},'primary')),el('p',{class:'quiet'},'El número de intentos, el tiempo y las ayudas de acceso no se convierten en una nota. Las creaciones necesitan observación.'),status);}
    const status=el('p',{role:'status'});paint();
  }
  function render(){if('speechSynthesis'in window)speechSynthesis.cancel();if(C.page==='catalog')catalog();else mission();}
  render();
})();

