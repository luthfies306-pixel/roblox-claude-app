import fs from "fs";
import path from "path";
import archiver from "archiver";

const OUTPUT_DIR = path.join(process.cwd(), "output");

const safeTargets = new Set(["StarterPlayerScripts", "StarterGui", "RojoFolder", "CustomExport"]);

export function normalizeTarget(target: string) {
  if (!safeTargets.has(target)) return "CustomExport";
  return target;
}

export function getOutputRoot() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  return OUTPUT_DIR;
}

export function createTargetDirectory(target: string) {
  const normalized = normalizeTarget(target);
  const folder = path.join(getOutputRoot(), normalized);
  fs.mkdirSync(folder, { recursive: true });
  return folder;
}

export function saveGeneratedFile(target: string, filename: string, content: string) {
  const folder = createTargetDirectory(target);
  const safeName = filename.replace(/\\/g, "").replace(/\/+/, "");
  const filePath = path.join(folder, safeName);
  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
}

export function createMCPZip(target: string) {
  const folder = createTargetDirectory(target);
  const zipPath = path.join(getOutputRoot(), `${target}-mcp-${Date.now()}.zip`);
  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  return new Promise<string>((resolve, reject) => {
    output.on("close", () => resolve(zipPath));
    archive.on("error", (error) => reject(error));
    archive.pipe(output);
    archive.directory(folder, target);
    archive.finalize();
  });
}
