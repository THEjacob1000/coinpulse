"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => handleToggle()}
      className="bg-card/40 hover:bg-card/50 border-outline/5"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <MoonIcon className="h-4 w-4 transition-all dark:hidden" />
      ) : (
        <SunIcon className="h-4 w-4 transition-all hidden dark:block" />
      )}
    </Button>
  );
}
