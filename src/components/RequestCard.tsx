"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { updateRequestStatus } from "@/lib/actions"
import { SongRequest, RequestStatus } from "@prisma/client"

const STATUS_LABEL: Record<RequestStatus, string> = {
  PENDING: "รอ",
  PLAYING: "กำลังเล่น",
  DONE: "เสร็จ",
  REJECTED: "ข้าม",
}

const STATUS_VARIANT: Record<
  RequestStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "outline",
  PLAYING: "default",
  DONE: "secondary",
  REJECTED: "destructive",
}

export function RequestCard({ request }: { request: SongRequest }) {
  const [status, setStatus] = useState<RequestStatus>(request.status)
  const [loading, setLoading] = useState(false)

  async function changeStatus(next: RequestStatus) {
    setLoading(true)
    const result = await updateRequestStatus(request.id, next)
    if ("error" in result) {
      toast.error(result.error)
    } else {
      setStatus(next)
    }
    setLoading(false)
  }

  const tipDisplay =
    request.tipAmount != null
      ? `฿${(request.tipAmount / 100).toFixed(0)}`
      : null

  return (
    <Card className="w-full">
      <CardContent className="pt-4 pb-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <p className="font-semibold text-base leading-snug truncate">
              {request.songName}
            </p>
            {request.bandName && (
              <p className="text-sm text-muted-foreground truncate">
                {request.bandName}
              </p>
            )}
          </div>
          <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {request.customerName && <span>ชื่อ: {request.customerName}</span>}
          {request.tableNumber && <span>โต๊ะ: {request.tableNumber}</span>}
          {tipDisplay && (
            <span className="text-primary font-medium">ทิป: {tipDisplay}</span>
          )}
        </div>

        {request.slipBase64 && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="self-start">
                <img
                  src={request.slipBase64}
                  alt="slip"
                  className="h-14 w-14 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm p-2">
              <img
                src={request.slipBase64}
                alt="slip full"
                className="w-full rounded"
              />
            </DialogContent>
          </Dialog>
        )}

        {status === "PENDING" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => changeStatus("PLAYING")}
              disabled={loading}
              className="flex-1"
            >
              เล่นเลย
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => changeStatus("DONE")}
              disabled={loading}
              className="flex-1"
            >
              เสร็จแล้ว
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => changeStatus("REJECTED")}
              disabled={loading}
              className="flex-1"
            >
              ข้าม
            </Button>
          </div>
        )}

        {status === "PLAYING" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => changeStatus("DONE")}
            disabled={loading}
          >
            เล่นเสร็จแล้ว
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
