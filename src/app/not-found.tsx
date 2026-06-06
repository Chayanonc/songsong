import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MusicNoteIllustration } from "@/components/illustrations/MusicNoteIllustration"

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background px-4 text-center gap-6">
      <MusicNoteIllustration className="w-28 h-28 text-primary opacity-60" />
      <div className="flex flex-col gap-2">
        <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase">
          404
        </p>
        <h1 className="text-2xl font-semibold">ไม่พบห้องนี้</h1>
        <p className="text-sm text-muted-foreground">
          ห้องอาจหมดอายุแล้ว หรือรหัสอาจไม่ถูกต้อง
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">กลับหน้าแรก</Link>
      </Button>
    </div>
  )
}
