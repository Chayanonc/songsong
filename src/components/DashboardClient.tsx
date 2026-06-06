"use client"

import { useEffect, useState } from "react"
import QRCode from "react-qr-code"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MusicNoteIllustration } from "@/components/illustrations/MusicNoteIllustration"
import { QrFrameIllustration } from "@/components/illustrations/QrFrameIllustration"
import { RequestCard } from "@/components/RequestCard"
import { SongRequest } from "@prisma/client"

interface DashboardClientProps {
  code: string
  requestUrl: string
  initialRequests: SongRequest[]
}

export function DashboardClient({
  code,
  requestUrl,
  initialRequests,
}: DashboardClientProps) {
  const [requests, setRequests] = useState<SongRequest[]>(initialRequests)

  useEffect(() => {
    const es = new EventSource(`/api/room/${code}/events`)

    es.onmessage = (e) => {
      const msg = JSON.parse(e.data) as {
        type: "snapshot" | "added" | "updated"
        requests: SongRequest[]
      }

      if (msg.type === "snapshot") {
        setRequests(msg.requests)
      } else if (msg.type === "added") {
        setRequests((prev) => [...msg.requests, ...prev])
      } else if (msg.type === "updated") {
        setRequests((prev) =>
          prev.map((r) => {
            const updated = msg.requests.find((u) => u.id === r.id)
            return updated ?? r
          })
        )
      }
    }

    return () => es.close()
  }, [code])

  const pending = requests.filter((r) => r.status === "PENDING")
  const playing = requests.filter((r) => r.status === "PLAYING")
  const done = requests.filter(
    (r) => r.status === "DONE" || r.status === "REJECTED"
  )

  return (
    <div className="flex flex-col gap-6 w-full max-w-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            รหัสห้อง
          </p>
          <p className="text-3xl font-mono font-bold tracking-widest text-primary">
            {code}
          </p>
        </div>

        {/* QR Code Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              QR Code
            </Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center gap-4 p-6 max-w-xs">
            <p className="text-sm text-muted-foreground">
              ให้ลูกค้าสแกนเพื่อขอเพลง
            </p>
            <div className="relative flex items-center justify-center">
              <QrFrameIllustration className="absolute inset-0 w-full h-full text-primary opacity-40" />
              <div className="p-4">
                <QRCode value={requestUrl} size={180} />
              </div>
            </div>
            <p className="font-mono text-lg font-bold tracking-widest text-primary">
              {code}
            </p>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      {/* Playing now */}
      {playing.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary">
            กำลังเล่น
          </h2>
          {playing.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </section>
      )}

      {/* Pending queue */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          คำขอ ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground">
            <MusicNoteIllustration className="w-20 h-20 opacity-40" />
            <p className="text-sm">ยังไม่มีคำขอเพลง</p>
          </div>
        ) : (
          pending.map((r) => <RequestCard key={r.id} request={r} />)
        )}
      </section>

      {/* Done / Rejected */}
      {done.length > 0 && (
        <section className="flex flex-col gap-3">
          <Separator />
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            ประวัติ
          </h2>
          {done.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </section>
      )}
    </div>
  )
}
