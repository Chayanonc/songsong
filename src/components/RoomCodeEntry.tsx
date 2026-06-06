"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function RoomCodeEntry() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError("กรุณาใส่รหัสห้อง");
      return;
    }
    router.push(`/room/${trimmed}/request`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
      <Input
        value={code}
        onChange={(e) => {
          setCode(e.target.value.toUpperCase());
          setError("");
        }}
        placeholder="เช่น AX7K2P"
        maxLength={6}
        className="text-center font-mono font-bold tracking-[0.3em] uppercase rounded-xl h-11 border-border focus-visible:ring-primary/20 bg-background text-lg placeholder:tracking-normal placeholder:font-sans placeholder:font-normal placeholder:text-sm"
      />
      {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}
      <Button
        type="submit"
        className="w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/15 active:scale-98"
      >
        เข้าสู่ห้องขอเพลง
      </Button>
    </form>
  );
}
