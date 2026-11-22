import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";

const JOBS_DIR = path.join(os.tmpdir(), "sourcepull-jobs");

export async function GET(
  _req: NextRequest,
  { params }: { params: { jobId: string; filename: string } }
) {
  const { jobId, filename } = params;

  // Security: sanitize paths
  const safeJobId = jobId.replace(/[^a-z0-9-]/gi, "");
  const safeFilename = path.basename(filename);

  const filePath = path.join(JOBS_DIR, safeJobId, safeFilename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "File not found or expired" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileSize = fs.statSync(filePath).size;

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${safeFilename}"`,
      "Content-Length": String(fileSize),
      "Cache-Control": "private, no-store",
    },
  });
}
