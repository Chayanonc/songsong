"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RoomCodeEntry } from "@/components/RoomCodeEntry";
import { createRoom, validateRoomCode } from "@/lib/actions";

const ROOM_KEY = "musician_room_code";

export function HomeTabs() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [existingCode, setExistingCode] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem(ROOM_KEY);
    if (!code) {
      setSessionChecked(true);
      return;
    }
    validateRoomCode(code).then(({ valid }) => {
      if (valid) {
        setExistingCode(code);
      } else {
        localStorage.removeItem(ROOM_KEY);
      }
      setSessionChecked(true);
    });
  }, []);

  function handleCreateRoom() {
    startTransition(async () => {
      const { code } = await createRoom();
      localStorage.setItem(ROOM_KEY, code);
      router.push(`/room/${code}`);
    });
  }

  return (
    <Tabs defaultValue="musician" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="musician">นักดนตรี</TabsTrigger>
        <TabsTrigger value="customer">ลูกค้า</TabsTrigger>
      </TabsList>

      <TabsContent value="musician" className="mt-4 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          สร้างห้องรับคำขอเพลง แชร์ QR code ให้ลูกค้า
        </p>

        {sessionChecked && existingCode && (
          <div className="flex flex-col gap-2 rounded-lg border bg-muted/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">ห้องที่เปิดอยู่</p>
            <p className="font-mono text-xl font-bold tracking-widest text-primary">
              {existingCode}
            </p>
            <Button
              onClick={() => router.push(`/room/${existingCode}`)}
              className="w-full"
            >
              กลับห้องเดิม
            </Button>
          </div>
        )}

        <Button
          onClick={handleCreateRoom}
          disabled={isPending}
          variant={existingCode ? "outline" : "default"}
          className="w-full"
        >
          {isPending ? "กำลังสร้าง..." : "สร้างห้องใหม่"}
        </Button>
      </TabsContent>

      <TabsContent value="customer" className="mt-4 flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          ใส่รหัสห้อง 6 ตัวที่ได้จากนักดนตรี
        </p>
        <RoomCodeEntry />
      </TabsContent>
    </Tabs>
  );
}
