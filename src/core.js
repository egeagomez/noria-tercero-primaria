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

