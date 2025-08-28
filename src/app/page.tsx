"use client";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Button as={Link} href="/dashboard">
        hello world
      </Button>
    </>
  );
}
