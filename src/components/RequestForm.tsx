"use client"

import { useActionState, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SuccessIllustration } from "@/components/illustrations/SuccessIllustration"
import { submitSongRequest } from "@/lib/actions"

interface RequestFormProps {
  roomCode: string
}

const initialState = undefined

export function RequestForm({ roomCode }: RequestFormProps) {
  const [state, action, pending] = useActionState(submitSongRequest, initialState)
  const [slipBase64, setSlipBase64] = useState("")
  const [slipError, setSlipError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function handleSlipChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 380_000) {
      setSlipError("ไฟล์ใหญ่เกินไป (สูงสุด 375 KB)")
      if (fileRef.current) fileRef.current.value = ""
      return
    }
    setSlipError("")
    const reader = new FileReader()
    reader.onload = () => setSlipBase64(reader.result as string)
    reader.readAsDataURL(file)
  }

  if (state && "success" in state) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <SuccessIllustration className="w-28 h-28 text-primary" />
        <h2 className="text-xl font-semibold">ส่งคำขอแล้ว!</h2>
        <p className="text-sm text-muted-foreground">
          รอฟังเพลงของคุณได้เลย
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setSlipBase64("")
            setSlipError("")
            if (fileRef.current) fileRef.current.value = ""
            // Reset form state by reloading action state — easiest via page reload
            window.location.reload()
          }}
        >
          ขอเพลงอีกเพลง
        </Button>
      </div>
    )
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="roomCode" value={roomCode} />
      <input type="hidden" name="slipBase64" value={slipBase64} />

      {/* Song name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="songName">
          ชื่อเพลง <span className="text-destructive">*</span>
        </Label>
        <Input
          id="songName"
          name="songName"
          placeholder="เช่น ดาวที่เหนือกว่า"
          required
        />
      </div>

      {/* Band */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="bandName">วง / ศิลปิน (optional)</Label>
        <Input
          id="bandName"
          name="bandName"
          placeholder="เช่น Bodyslam"
        />
      </div>

      <Separator />

      {/* Customer name */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="customerName">ชื่อผู้ขอ (optional)</Label>
        <Input
          id="customerName"
          name="customerName"
          placeholder="เช่น น้องหนู"
        />
      </div>

      {/* Table */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tableNumber">โต๊ะ (optional)</Label>
        <Input
          id="tableNumber"
          name="tableNumber"
          placeholder="เช่น A3"
        />
      </div>

      {/* Tip */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tipAmount">ทิป (บาท) (optional)</Label>
        <Input
          id="tipAmount"
          name="tipAmount"
          type="number"
          min="0"
          step="1"
          placeholder="เช่น 100"
        />
      </div>

      {/* Slip */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="slip">สลิป (optional)</Label>
        <Input
          id="slip"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleSlipChange}
          className="cursor-pointer"
        />
        {slipError && (
          <p className="text-xs text-destructive">{slipError}</p>
        )}
        {slipBase64 && !slipError && (
          <img
            src={slipBase64}
            alt="preview"
            className="h-20 w-20 object-cover rounded border"
          />
        )}
      </div>

      {state && "error" in state && (
        <p className="text-sm text-destructive text-center">{state.error}</p>
      )}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "กำลังส่ง..." : "ขอเพลง"}
      </Button>
    </form>
  )
}
