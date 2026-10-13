import { NextRequest, NextResponse } from "next/server";
import { generateFromClaude, readPromptTemplate } from "../../lib/claude";
import { createMCPZip, createTargetDirectory, saveGeneratedFile } from "../../lib/fileWriter";

function parseMetadata(content: string) {
  const match = content.match(/--METADATA--(\{.*\})--METADATA--/s);
  if (!match) return { filename: "Generated.lua", path: "CustomExport" };

  try {
    const parsed = JSON.parse(match[1]);
    return {
      filename: parsed.filename || "Generated.lua",
      path: parsed.path || "CustomExport",
    };
  } catch {
    return { filename: "Generated.lua", path: "CustomExport" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = String(body.prompt || "").trim();
    const target = String(body.target || "StarterPlayerScripts").trim();
    const filename = String(body.filename || "Generated.lua").trim();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const template = readPromptTemplate();
    const finalPrompt = template
      .replace("{{USER_PROMPT}}", prompt)
      .replace("{{TARGET}}", target)
      .replace("{{FILENAME}}", filename);

    const result = await generateFromClaude(finalPrompt, target, filename);
    const content = result.content || "";

    const forbidden = ["os.execute", "io.popen", "loadstring", "setfenv", "require(\"http\")", "require('http')"];
    const containsForbidden = forbidden.some((item) => content.includes(item));
    if (containsForbidden) {
      return NextResponse.json({ error: "Generated code contains disallowed content" }, { status: 400 });
    }

    const metadata = parseMetadata(content);
    const savedFile = saveGeneratedFile(metadata.path, metadata.filename, content);
    const zipFile = await createMCPZip(metadata.path);

    const relativeSaved = savedFile.replace(process.cwd(), "").replace(/\\/g, "/");
    const relativeZip = zipFile.replace(process.cwd(), "").replace(/\\/g, "/");

    return NextResponse.json({
      code: content,
      savedPath: relativeSaved,
      downloadUrl: `/api/download?path=${encodeURIComponent(relativeZip)}`,
      zipPath: relativeZip,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate the file" }, { status: 500 });
  }
}
