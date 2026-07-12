"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "transitops.general.v1";
const DEFAULTS = { depot: "", currency: "INR (₹)", distanceUnit: "Kilometers" };

export function GeneralSettings() {
  const [form, setForm] = React.useState(DEFAULTS);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setForm({ ...DEFAULTS, ...JSON.parse(saved) });
    } catch {
      /* ignore */
    }
  }, []);

  function update(key: keyof typeof DEFAULTS, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      toast.success("Preferences saved on this device");
    } catch {
      toast.error("Could not save preferences");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>Depot and unit preferences for this device.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="depot">Depot name</Label>
          <Input
            id="depot"
            value={form.depot}
            placeholder="Gandhinagar Depot GJ4"
            onChange={(e) => update("depot", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={form.currency}
            onChange={(e) => update("currency", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="distance">Distance unit</Label>
          <Input
            id="distance"
            value={form.distanceUnit}
            onChange={(e) => update("distanceUnit", e.target.value)}
          />
        </div>
        <Button onClick={save}>Save changes</Button>
      </CardContent>
    </Card>
  );
}
