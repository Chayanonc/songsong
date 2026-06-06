import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function RoomLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!room || room.expiresAt < new Date()) {
    notFound();
  }

  return <>{children}</>;
}
