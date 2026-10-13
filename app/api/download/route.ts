import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileParam = searchParams.get("path");

  if (!fileParam) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  const safePath = path.join(process.cwd(), fileParam.replace(/^\/+/, ""));
  if (!safePath.startsWith(process.cwd())) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  try {
    const data = fs.readFileSync(safePath);
    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${path.basename(safePath)}"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
