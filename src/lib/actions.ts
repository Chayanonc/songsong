"use server";

import { nanoid } from "nanoid";
import { prisma } from "./prisma";
import { RequestStatus } from "@prisma/client";

export async function createRoom(): Promise<{ code: string }> {
  let code: string | null = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = nanoid(6).toUpperCase();
    const existing = await prisma.room.findUnique({
      where: { code: candidate },
    });
    if (!existing) {
      code = candidate;
      break;
    }
  }
  if (!code) throw new Error("Failed to generate unique room code");

  await prisma.room.create({
    data: {
      code,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return { code };
}

export async function validateRoomCode(
  code: string,
): Promise<{ valid: boolean }> {
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
  });
  if (!room || room.expiresAt < new Date()) return { valid: false };
  return { valid: true };
}

export async function submitSongRequest(
  _prevState: unknown,
  formData: FormData,
): Promise<{ success: true; id: string } | { error: string }> {
  const roomCode = (formData.get("roomCode") as string | null)?.toUpperCase();
  const songName = (formData.get("songName") as string | null)?.trim();
  const bandName = (formData.get("bandName") as string | null)?.trim() || null;
  const customerName =
    (formData.get("customerName") as string | null)?.trim() || null;
  const tableNumber =
    (formData.get("tableNumber") as string | null)?.trim() || null;
  const tipRaw = (formData.get("tipAmount") as string | null)?.trim();

  if (!roomCode) return { error: "เอ๊ะ! ไม่พบรหัสห้องนี้แฮะ ลองเช็กดูอีกทีน้า" };
  if (!songName) return { error: "อย่าลืมพิมพ์ชื่อเพลงด้วยน้า 🎵" };

  const room = await prisma.room.findUnique({ where: { code: roomCode } });
  if (!room || room.expiresAt < new Date())
    return { error: "ห้องดนตรีนี้อาจจะหมดอายุ (24 ชม.) หรือปิดไปแล้วจ้า" };

  let tipAmount: number | null = null;
  if (tipRaw) {
    const parsed = parseFloat(tipRaw);
    if (!isNaN(parsed) && parsed >= 0) {
      tipAmount = Math.round(parsed * 100);
    }
  }

  const request = await prisma.songRequest.create({
    data: {
      roomId: room.id,
      songName,
      bandName,
      customerName,
      tableNumber,
      tipAmount,
    },
  });

  return { success: true, id: request.id };
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
): Promise<{ success: boolean } | { error: string }> {
  try {
    await prisma.songRequest.update({
      where: { id: requestId },
      data: { status },
    });
    return { success: true };
  } catch {
    return { error: "เกิดข้อผิดพลาดในการอัปเดตสถานะ ลองใหม่อีกครั้งนะจ๊ะ" };
  }
}

export async function closeRoom(
  code: string,
): Promise<{ success: boolean } | { error: string }> {
  try {
    await prisma.room.delete({ where: { code: code.toUpperCase() } });
    return { success: true };
  } catch {
    return { error: "เกิดข้อผิดพลาดในการปิดห้อง ลองใหม่อีกครั้งนะจ๊ะ" };
  }
}

export async function updateRoomSettings(
  code: string,
  data: {
    musicianName?: string;
    bankName?: string;
    bankAccount?: string;
    bankAccountName?: string;
    paymentQrBase64?: string | null;
  },
): Promise<{ success: boolean } | { error: string }> {
  try {
    await prisma.room.update({
      where: { code: code.toUpperCase() },
      data: {
        musicianName: data.musicianName?.trim() || null,
        bankName: data.bankName?.trim() || null,
        bankAccount: data.bankAccount?.trim() || null,
        bankAccountName: data.bankAccountName?.trim() || null,
        ...(data.paymentQrBase64 !== undefined && {
          paymentQrBase64: data.paymentQrBase64,
        }),
      },
    });
    return { success: true };
  } catch {
    return { error: "เกิดข้อผิดพลาดในการบันทึกการตั้งค่า ลองใหม่อีกครั้งนะจ๊ะ" };
  }
}
