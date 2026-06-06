import { MicrophoneIllustration } from "@/components/illustrations/MicrophoneIllustration";
import { HomeTabs } from "@/components/HomeTabs";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background px-4 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        {/* Hero */}
        <div className="flex flex-col items-center gap-3 text-center">
          <MicrophoneIllustration className="w-28 h-28 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">SongSong</h1>
          <p className="text-muted-foreground text-sm">
            ขอเพลงง่าย ๆ ให้พี่ ๆ นักดนตรีสด — ขอมาก็จัดให้ ไม่ต้อง Login! 🎶
          </p>
        </div>

        <HomeTabs />
      </div>
    </div>
  );
}
