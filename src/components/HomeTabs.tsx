"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RoomCodeEntry } from "@/components/RoomCodeEntry";
import { createRoom, validateRoomCode } from "@/lib/actions";
import { IconMusic, IconUser, IconPlus } from "@tabler/icons-react";

const ROOM_KEY = "musician_room_code";

export function HomeTabs() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [existingCode, setExistingCode] = useState<string | null>(null);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem(ROOM_KEY);
    const check = code ? validateRoomCode(code) : Promise.resolve(null);
    check.then((result) => {
      if (result?.valid) {
        setExistingCode(code);
      } else if (code) {
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
    <div className="w-full bg-card border border-border/80 p-5 rounded-2xl shadow-sm">
      <Tabs defaultValue="customer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-muted rounded-xl h-11 mb-2">
          <TabsTrigger
            value="customer"
            className="rounded-lg cursor-pointer gap-1.5 text-xs font-semibold"
          >
            <IconUser className="w-3.5 h-3.5" />
            ลูกค้า (ขอเพลง)
          </TabsTrigger>
          <TabsTrigger
            value="musician"
            className="rounded-lg cursor-pointer gap-1.5 text-xs font-semibold"
          >
            <IconMusic className="w-3.5 h-3.5" />
            นักดนตรี (เปิดห้อง)
          </TabsTrigger>
        </TabsList>

        {/* Customer Content */}
        <TabsContent value="customer" className="mt-4 flex flex-col gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              เข้าห้องขอเพลง
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              กรอกรหัสห้อง 6 หลักที่คุณได้รับจากนักดนตรี เพื่อเริ่มส่งคำขอเพลง
            </p>
          </div>
          <RoomCodeEntry />
        </TabsContent>

        {/* Musician Content */}
        <TabsContent value="musician" className="mt-4 flex flex-col gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">
              รับคำขอเพลงสด
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              สร้างห้องขอเพลงของคุณ จากนั้นแชร์ QR Code
              หรือรหัสห้องเพื่อรับเพลงจากลูกค้าแบบเรียลไทม์
            </p>
          </div>

          {sessionChecked && existingCode && (
            <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/[0.015] p-4 text-center mt-1">
              <div className="flex items-center justify-center gap-1.5 mx-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                  คุณมีห้องที่เปิดใช้งานอยู่
                </span>
              </div>
              <p className="font-mono text-2xl font-bold tracking-widest text-primary leading-none">
                {existingCode}
              </p>
              <div className="flex gap-2 mt-1">
                <Button
                  onClick={() => router.push(`/room/${existingCode}`)}
                  className="flex-1 rounded-xl h-10 font-semibold text-xs cursor-pointer shadow-sm active:scale-98"
                >
                  กลับห้องเดิม
                </Button>
                <Button
                  onClick={handleCreateRoom}
                  disabled={isPending}
                  variant="outline"
                  className="rounded-xl h-10 font-semibold text-xs cursor-pointer hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 border-border"
                >
                  {isPending ? "กำลังสร้าง..." : "สร้างห้องใหม่"}
                </Button>
              </div>
            </div>
          )}

          {(!existingCode || !sessionChecked) && (
            <Button
              onClick={handleCreateRoom}
              disabled={isPending}
              className="w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/15 active:scale-98 gap-1.5"
            >
              <IconPlus className="w-4 h-4" />
              {isPending ? "กำลังสร้างห้อง..." : "สร้างห้องเพลงใหม่"}
            </Button>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
