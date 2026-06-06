import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RequestForm } from "@/components/RequestForm";
import { MicrophoneIllustration } from "@/components/illustrations/MicrophoneIllustration";

export default async function RequestPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  const room = await prisma.room.findUnique({ where: { code: upperCode } });
  if (!room || room.expiresAt < new Date()) notFound();

  return (
    <div className="flex flex-col flex-1 items-center min-h-screen bg-background px-4 py-10">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <MicrophoneIllustration className="w-16 h-16 text-primary" />
          <h1 className="text-xl font-bold">ขอเพลง</h1>
          <p className="text-xs text-muted-foreground font-mono tracking-widest">
            ห้อง {upperCode}
          </p>
        </div>

        <RequestForm roomCode={upperCode} />
      </div>
    </div>
  );
}
