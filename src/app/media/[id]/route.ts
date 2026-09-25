import { NextResponse } from "next/server";
import { getPublicMediaAssetById, readMediaPublicBuffer } from "@/lib/media/editorial-media";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Params) {
  const { id } = await context.params;
  const asset = await getPublicMediaAssetById(id);

  if (!asset) {
    return new NextResponse("Not Found", { status: 404 });
  }

  try {
    const file = await readMediaPublicBuffer(asset.storageKeyPublic);
    const response = new NextResponse(new Uint8Array(file.buffer), { status: 200 });
    response.headers.set("Content-Type", asset.mimeType);
    response.headers.set("Content-Length", String(file.buffer.byteLength));
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Cache-Control", "public, max-age=0, must-revalidate");
    response.headers.set("Content-Disposition", `inline; filename="${asset.id}"`);
    return response;
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
