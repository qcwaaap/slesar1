/**
 * Упаковывает всё содержимое out/ в deploy-cardizel.zip (удобно залить на REG.RU одним архивом).
 * Сначала: npm run build && node scripts/verify-out.mjs
 */
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "out");
const zipPath = path.join(root, "deploy-cardizel.zip");

if (!fs.existsSync(path.join(outDir, "index.html"))) {
  console.error("Сначала выполните: npm run build");
  process.exit(1);
}
if (!fs.existsSync(path.join(outDir, "_next"))) {
  console.error("Нет out/_next — выполните: npm run build");
  process.exit(1);
}

const outPosix = outDir.replace(/\\/g, "/");
const zipPosix = zipPath.replace(/\\/g, "/");

if (process.platform === "win32") {
  execFileSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path '${outPosix}/*' -DestinationPath '${zipPosix}' -Force`,
    ],
    { stdio: "inherit", cwd: root }
  );
  console.log(`\n✅ Создан архив: ${zipPath}`);
  console.log("   Загрузите его в панель REG.RU и распакуйте в public_html (содержимое архива — в корень сайта).");
} else {
  try {
    execFileSync("zip", ["-r", zipPath, "."], { cwd: outDir, stdio: "inherit" });
    console.log(`\n✅ Создан: ${zipPath}`);
  } catch {
    console.error("Установите zip или упакуйте папку out/ вручную.");
    process.exit(1);
  }
}
