"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun01Icon, ComputerIcon } from "@hugeicons/core-free-icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;

  const options = [
    { value: "dark", icon: Moon02Icon, label: "Dark" },
    { value: "light", icon: Sun01Icon, label: "Light" },
    { value: "system", icon: ComputerIcon, label: "System" },
  ] as const;

  return (
    <div className="fixed top-4 right-4 md:top-6 md:right-6 z-50 flex items-center gap-[2px] rounded-full border border-foreground/10 bg-foreground/5 backdrop-blur-sm px-1 py-1">
      {options.map(({ value, icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-label={`Switch to ${label} theme`}
          className={`
            w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200
            ${theme === value
              ? "bg-foreground/15 text-foreground"
              : "text-foreground/40 hover:text-foreground/70"
            }
          `}
        >
          <HugeiconsIcon icon={icon} size={14} strokeWidth={1.5} />
        </button>
      ))}
    </div>
  );
}
