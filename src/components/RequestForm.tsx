"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

  async function onSubmit(values: FormValues) {
    setServerError("");

    const formData = new FormData();
    formData.set("roomCode", roomCode);
    formData.set("songName", values.songName);
    if (values.bandName) formData.set("bandName", values.bandName);
    if (values.customerName) formData.set("customerName", values.customerName);
    if (values.tableNumber) formData.set("tableNumber", values.tableNumber);
    if (values.tipAmount) formData.set("tipAmount", values.tipAmount);

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
