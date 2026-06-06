import { prisma } from "@/lib/prisma";
import { SongRequest } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!room || room.expiresAt < new Date()) {
    return new Response("Room not found", { status: 404 });
  }

  let lastSnapshot: SongRequest[] = [];

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();

      const send = (data: unknown) => {
        try {
          controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // client disconnected
        }
      };

      // Send initial snapshot
      const initial = await prisma.songRequest.findMany({
        where: { roomId: room.id },
        orderBy: { createdAt: "desc" },
      });
      lastSnapshot = initial;
      send({ type: "snapshot", requests: initial });

      const interval = setInterval(async () => {
        try {
          const current = await prisma.songRequest.findMany({
            where: { roomId: room.id },
            orderBy: { createdAt: "desc" },
          });

          // Find new requests
          const lastIds = new Set(lastSnapshot.map((r) => r.id));
          const added = current.filter((r) => !lastIds.has(r.id));

          // Find status-changed requests
          const lastMap = new Map(lastSnapshot.map((r) => [r.id, r.status]));
          const updated = current.filter(
            (r) => lastMap.has(r.id) && lastMap.get(r.id) !== r.status,
          );

          if (added.length > 0) send({ type: "added", requests: added });
          if (updated.length > 0) send({ type: "updated", requests: updated });

          lastSnapshot = current;
        } catch {
          // DB error — skip tick
        }
      }, 2000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          // already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
