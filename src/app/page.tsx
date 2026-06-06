import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MicrophoneIllustration } from "@/components/illustrations/MicrophoneIllustration";
import { RoomCodeEntry } from "@/components/RoomCodeEntry";
import { createRoom } from "@/lib/actions";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <MicrophoneIllustration className="w-28 h-28 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">SongSong</h1>
          <p className="text-muted-foreground text-sm">
            ระบบขอเพลงสำหรับนักดนตรีสด — ง่าย ไม่ต้อง login
          </p>
        </div>

        {/* Create Room */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base">นักดนตรี</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              สร้างห้องรับคำขอเพลง แชร์ QR code ให้ลูกค้า
            </p>
            <form action={createRoom}>
              <Button type="submit" className="w-full">
                สร้างห้องใหม่
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Join Room */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-base">ลูกค้า</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              ใส่รหัสห้อง 6 ตัวที่ได้จากนักดนตรี
            </p>
            <RoomCodeEntry />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
