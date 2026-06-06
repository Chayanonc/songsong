import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/DashboardClient";
import { notFound } from "next/navigation";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const upperCode = code.toUpperCase();

  const room = await prisma.room.findUnique({
    where: { code: upperCode },
    include: {
      requests: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!room || room.expiresAt < new Date()) notFound();

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const requestUrl = `${protocol}://${host}/room/${upperCode}/request`;

  return (
    <DashboardClient
      code={upperCode}
      requestUrl={requestUrl}
      initialRequests={room.requests}
      initialSettings={{
        musicianName: room.musicianName,
        bankName: room.bankName,
        bankAccount: room.bankAccount,
        bankAccountName: room.bankAccountName,
        paymentQrBase64: room.paymentQrBase64,
      }}
    />
  );
}
