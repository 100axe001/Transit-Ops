"use client";

import * as React from "react";
import { LayoutDashboard, Truck, Route, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "transitops.tour.completed.v1";

const STEPS = [
  {
    Icon: LayoutDashboard,
    title: "Welcome to TransitOps",
    body: "Your control center for fleet, drivers, trips, maintenance, and costs. Here's a quick 30-second tour.",
  },
  {
    Icon: Truck,
    title: "Vehicles & Drivers",
    body: "Register your fleet and drivers. Their statuses update automatically as trips are dispatched and maintenance is logged.",
  },
  {
    Icon: Route,
    title: "Dispatch Trips",
    body: "Create a trip, pick an available vehicle and driver, and dispatch. TransitOps enforces capacity, license, and availability rules for you.",
  },
  {
    Icon: BarChart3,
    title: "Insights & Reports",
    body: "Track fuel efficiency, operational cost, fleet utilization, and vehicle ROI — and export any report to CSV.",
  },
] as const;

export function WelcomeTour() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      /* localStorage unavailable — skip the tour silently */
    }
  }, []);

  const finish = React.useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const { Icon } = current;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) finish();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <DialogTitle>{current.title}</DialogTitle>
          <DialogDescription>{current.body}</DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-1.5 py-1">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={finish}>
            Skip
          </Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                Back
              </Button>
            )}
            {isLast ? (
              <Button onClick={finish}>Get started</Button>
            ) : (
              <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
