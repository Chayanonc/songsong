"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SuccessIllustration } from "@/components/illustrations/SuccessIllustration";
import { submitSongRequest } from "@/lib/actions";

const schema = z.object({
  songName: z.string().min(1, "กรุณาใส่ชื่อเพลง"),
  bandName: z.string().optional(),
  customerName: z.string().optional(),
  tableNumber: z.string().optional(),
  tipAmount: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RequestFormProps {
  roomCode: string;
}

export function RequestForm({ roomCode }: RequestFormProps) {
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [slipBase64, setSlipBase64] = useState("");
  const [slipError, setSlipError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      songName: "",
      bandName: "",
      customerName: "",
      tableNumber: "",
      tipAmount: "",
    },
  });

  function handleSlipChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 380_000) {
      setSlipError("ไฟล์ใหญ่เกินไป (สูงสุด 375 KB)");
      e.target.value = "";
      return;
    }
    setSlipError("");
    const reader = new FileReader();
    reader.onload = () => setSlipBase64(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function onSubmit(values: FormValues) {
    if (slipError) return;
    setServerError("");

    const formData = new FormData();
    formData.set("roomCode", roomCode);
    formData.set("songName", values.songName);
    if (values.bandName) formData.set("bandName", values.bandName);
    if (values.customerName) formData.set("customerName", values.customerName);
    if (values.tableNumber) formData.set("tableNumber", values.tableNumber);
    if (values.tipAmount) formData.set("tipAmount", values.tipAmount);
    if (slipBase64) formData.set("slipBase64", slipBase64);

    const result = await submitSongRequest(undefined, formData);
    if ("error" in result) {
      setServerError(result.error);
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <SuccessIllustration className="w-28 h-28 text-primary" />
        <h2 className="text-xl font-semibold">ส่งคำขอแล้ว!</h2>
        <p className="text-sm text-muted-foreground">รอฟังเพลงของคุณได้เลย</p>
        <Button
          variant="outline"
          onClick={() => {
            setSuccess(false);
            setServerError("");
            setSlipBase64("");
            setSlipError("");
            if (fileRef.current) fileRef.current.value = "";
            form.reset();
          }}
        >
          ขอเพลงอีกเพลง
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="songName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ชื่อเพลง <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="เช่น ดาวที่เหนือกว่า" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bandName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                วง / ศิลปิน{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="เช่น Bodyslam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ชื่อผู้ขอ{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="เช่น น้องหนู" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tableNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                โต๊ะ{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input placeholder="เช่น A3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tipAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ทิป (บาท){" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="เช่น 100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slip — file input with base64 preview, validated separately */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slip">
            สลิป{" "}
            <span className="text-muted-foreground text-xs font-normal">
              (optional)
            </span>
          </Label>
          <Input
            id="slip"
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleSlipChange}
            className="cursor-pointer"
          />
          {slipError && (
            <p className="text-[0.8rem] font-medium text-destructive">
              {slipError}
            </p>
          )}
          {slipBase64 && !slipError && (
            <img
              src={slipBase64}
              alt="preview"
              className="h-20 w-20 object-cover rounded border"
            />
          )}
        </div>

        {serverError && (
          <p className="text-sm text-destructive text-center">{serverError}</p>
        )}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting ? "กำลังส่ง..." : "ขอเพลง"}
        </Button>
      </form>
    </Form>
  );
}
