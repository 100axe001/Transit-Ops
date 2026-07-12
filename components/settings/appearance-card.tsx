"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const THEMES = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

export function AppearanceCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const active = mounted ? theme : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Choose how TransitOps looks on this device. System follows your OS setting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid max-w-md grid-cols-3 gap-3">
          {THEMES.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setTheme(value)}
              aria-pressed={active === value}
              className={cn(
                "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors",
                active === value
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
