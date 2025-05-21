"use client";

import React from "react";
import { Button, ButtonProps } from "./ui/button";
import { PanelLeft, PanelRight } from "lucide-react";
import { useSidebar } from "@/contexts/sidebar";

export default function SidebarToggleButton({ ...props }: ButtonProps) {
    const { isOpen, toggleSidebar } = useSidebar();

  return (
    <Button size={"icon"} variant={"ghost"} {...props} onClick={toggleSidebar}>
      {isOpen ? <PanelLeft /> : <PanelRight />}
    </Button>
  );
}
