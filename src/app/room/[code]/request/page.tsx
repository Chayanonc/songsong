import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RequestForm } from "@/components/RequestForm";
import { MicrophoneIllustration } from "@/components/illustrations/MicrophoneIllustration";
import { PaymentInfoCard } from "@/components/PaymentInfoCard";

export default async function RequestPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  const room = await prisma.room.findUnique({ where: { code: upperCode } });
  if (!room || room.expiresAt < new Date()) notFound();

  const hasPaymentInfo = !!(
    room.paymentQrBase64 ||
    room.bankName ||
    room.bankAccount
  );

  return (
    <div className="flex flex-col flex-1 items-center min-h-screen bg-background px-4 py-8">
      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-2 text-center select-none mt-2">
          <div className="p-3.5 rounded-full bg-primary/5 text-primary border border-primary/10 mb-1">
            <MicrophoneIllustration className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">ขอเพลง</h1>
          <div className="flex items-center gap-1.5 justify-center">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <p className="text-xs text-muted-foreground font-semibold">
              {room.musicianName ? (
                <>
                  นักดนตรี:{" "}
                  <span className="text-foreground font-bold">
                    {room.musicianName}
                  </span>
                </>
              ) : (
                <>
                  ห้อง:{" "}
                  <span className="text-foreground font-mono font-bold tracking-wider">
                    {upperCode}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>

        {/* Payment / Support Channel info */}
        {hasPaymentInfo && (
          <PaymentInfoCard
            musicianName={room.musicianName}
            bankName={room.bankName}
            bankAccount={room.bankAccount}
            bankAccountName={room.bankAccountName}
            paymentQrBase64={room.paymentQrBase64}
          />
        )}

        {/* Request Form */}
        <RequestForm roomCode={upperCode} />
      </div>
    </div>
  );
}
