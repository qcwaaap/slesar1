/**
 * После `npm run build` проверяет, что статический экспорт содержит _next и ключевые файлы.
 * Запуск: node scripts/verify-out.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(__dirname, "..", "out");
const nextRoot = path.join(out, "_next");

function walkCount(dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) n += walkCount(p);
    else n += 1;
  }
  return n;
}

if (!fs.existsSync(path.join(out, "index.html"))) {
  console.error("❌ Нет out/index.html — сначала выполните: npm run build");
  process.exit(1);
}

if (!fs.existsSync(nextRoot)) {
  console.error("❌ Нет папки out/_next — без неё сайт без стилей/скриптов. Соберите проект: npm run build");
  process.exit(1);
}

const chunks = path.join(nextRoot, "static", "chunks");
if (!fs.existsSync(chunks)) {
  console.error("❌ Нет out/_next/static/chunks");
  process.exit(1);
}

const cssFiles = fs.readdirSync(chunks).filter((f) => f.endsWith(".css"));
if (cssFiles.length === 0) {
  console.error("❌ В chunks нет .css файлов");
  process.exit(1);
}

const fileCount = walkCount(nextRoot);
console.log("✅ Сборка out/ в порядке.");
console.log(`   • файлов в _next (рекурсивно): ${fileCount}`);
console.log(`   • CSS в _next/static/chunks: ${cssFiles.length} (${cssFiles.slice(0, 3).join(", ")}${cssFiles.length > 3 ? "…" : ""})`);
console.log("");
console.log("На хостинг заливайте ВСЁ содержимое папки out/ в корень сайта (вместе с _next).");
console.log("Проверка в браузере: https://ваш-домен/_next/static/chunks/<имя>.css должно открываться (не 404).");
