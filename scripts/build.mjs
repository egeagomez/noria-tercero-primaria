import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const atlasSource = join(root, 'openspec', 'changes', 'tercero-primaria-primer-trimestre', 'arte', 'personajes-atlas-v1.png');

function html(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}

function configuration(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function inlineScript(source) {
  return source.replace(/<\/script/gi, '<\\/script');
}

function document({ title, config, assetPrefix, css, javascript, atlas }) {
  const standalone = config.standalone === true;
  const style = standalone
    ? `<style>${css}\n:root { --atlas: url("${atlas}"); }</style>`
    : `<link rel="stylesheet" href="${assetPrefix}styles.css">`;
  const script = standalone
    ? `<script>${inlineScript(javascript)}</script>`
    : `<script src="${assetPrefix}app.js"></script>`;
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="description" content="Misiones de Matemáticas y Lengua para tercero de Primaria: La Noria de los Descubrimientos.">
  <title>${html(title)} · La Noria de los Descubrimientos</title>
  ${style}
</head>
<body>
  <div id="app"></div>
  <noscript>Activa JavaScript para realizar las misiones interactivas de La Noria de los Descubrimientos.</noscript>
  <script>window.NORIA_CONFIG = ${configuration(config)};</script>
  ${script}
</body>
</html>
`;
}

async function build() {
  const [mathematics, language, css, core, app, atlasBytes] = await Promise.all([
    readFile(join(root, 'contenidos', 'matematicas.json'), 'utf8'),
    readFile(join(root, 'contenidos', 'lengua.json'), 'utf8'),
    readFile(join(root, 'src', 'styles.css'), 'utf8'),
    readFile(join(root, 'src', 'core.js'), 'utf8'),
    readFile(join(root, 'src', 'app.js'), 'utf8'),
    readFile(atlasSource),
  ]);
  const subjects = [JSON.parse(mathematics), JSON.parse(language)];
  const calendar = JSON.parse(await readFile(join(root,'openspec','changes','tercero-primaria-primer-trimestre','calendario-semanal.json'),'utf8'));
  const ids = new Set();
  for (const subject of subjects) {
    if (!subject.slug || !subject.title || !Array.isArray(subject.missions)) {
      throw new Error('Cada asignatura necesita slug, title y missions.');
    }
    if(subject.missions.length !== 16) throw new Error(`Se requieren 16 misiones en ${subject.slug}.`);
    for (const mission of subject.missions) {
      if (!/^[A-Z0-9-]+$/.test(mission.id) || ids.has(mission.id)) {
        throw new Error(`Identificador de misión inválido o repetido: ${mission.id}`);
      }
      ids.add(mission.id);
      const week = calendar.weeks.find(w=>w.week===mission.week);
      if(!week) throw new Error(`Semana no válida: ${mission.id}`);
      mission.start=week.start;mission.end=week.end;mission.language='es';mission.contentVersion=1;
      if(!mission.title || !mission.goal || !mission.intro || !mission.criteria?.length || !mission.project?.model || !mission.project?.checklist?.length || !mission.tasks?.length) throw new Error(`Contenido incompleto: ${mission.id}`);
      for(const task of [...mission.tasks,...(mission.supportTasks || [])]) {
        if(!task.prompt || !task.hint || !task.explanation) throw new Error(`Actividad sin consigna, pista o explicación: ${mission.id}`);
        if(!['choice','number','order','match','builder'].includes(task.type)) throw new Error(`Tipo de actividad desconocido: ${mission.id}`);
        if(task.type==='choice' && (!Array.isArray(task.options) || !Number.isInteger(task.answer) || task.answer<0 || task.answer>=task.options.length)) throw new Error(`Opciones incompletas: ${mission.id}`);
        if(task.type==='number' && !Number.isFinite(task.answer)) throw new Error(`Respuesta numérica no válida: ${mission.id}`);
        if(task.type==='order' && (!Array.isArray(task.items) || task.items.length<2)) throw new Error(`Orden incompleto: ${mission.id}`);
        if(task.type==='match' && (!Array.isArray(task.pairs) || task.pairs.length<2)) throw new Error(`Relación incompleta: ${mission.id}`);
        if(task.type==='builder' && (!task.answer || !task.config)) throw new Error(`Constructor incompleto: ${mission.id}`);
      }
    }
  }

  const javascript = `${core}\n;\n${app}\n`;
  const atlas = `data:image/png;base64,${atlasBytes.toString('base64')}`;
  const assets = join(output, 'assets');
  const games = join(output, 'juegos');
  const downloads = join(output, 'descargas');
  await Promise.all([assets, games, downloads].map(folder => mkdir(folder, { recursive: true })));
  await Promise.all([
    writeFile(join(assets, 'styles.css'), `${css}\n:root { --atlas: url("personajes.png"); }\n`, 'utf8'),
    writeFile(join(assets, 'app.js'), javascript, 'utf8'),
    copyFile(atlasSource, join(assets, 'personajes.png')),
  ]);

  const metadata = [];
  for (const subject of subjects) {
    for (const mission of subject.missions) {
      metadata.push({
        id: mission.id,
        slug: subject.slug,
        subject: subject.slug,
        subjectTitle: subject.title,
        title: mission.title,
        week: mission.week,
        goal: mission.goal,
        guide: mission.guide,
        duration: mission.duration || ([1, 14, 16].includes(mission.week) ? '5–8 minutos' : '8–12 minutos'),
        start: mission.start,
        end: mission.end,
        language: mission.language,
        contentVersion: mission.contentVersion,
        url: `juegos/${mission.id}.html`,
        download: `descargas/${mission.id}.html`,
      });
      const config = {
        page: 'mission',
        mission,
        subject: subject.slug,
        subjectTitle: subject.title,
        home: '../index.html',
        download: `../descargas/${mission.id}.html`,
        standalone: false,
      };
      await Promise.all([
        writeFile(join(games, `${mission.id}.html`), document({
          title: `${subject.title}: ${mission.title}`,
          config, assetPrefix: '../assets/', css, javascript, atlas,
        }), 'utf8'),
        writeFile(join(downloads, `${mission.id}.html`), document({
          title: `${subject.title}: ${mission.title}`,
          config: { ...config, standalone: true, home: null, download: null },
          assetPrefix: '', css, javascript, atlas,
        }), 'utf8'),
      ]);
    }
  }
  await writeFile(join(output, 'index.html'), document({
    title: 'Misiones de tercero',
    config: { page: 'catalog', missions: metadata },
    assetPrefix: 'assets/', css, javascript, atlas,
  }), 'utf8');
  await writeFile(join(output, '.nojekyll'), '', 'utf8');
  console.log(`Construidas ${metadata.length} misiones con su HTML autónomo en ${output}`);
}

build().catch(error => {
  console.error(`No se ha podido construir La Noria: ${error.message}`);
  process.exitCode = 1;
});
