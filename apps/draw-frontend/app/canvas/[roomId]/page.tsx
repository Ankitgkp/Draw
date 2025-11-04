"use client";
import { RoomCanvas } from "@/components/RoomCanvas";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CanvasPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = use(params);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please sign in to access the canvas");
      router.push("/signin");
    }
  }, [router]);

  return <RoomCanvas roomId={roomId} />;
}
