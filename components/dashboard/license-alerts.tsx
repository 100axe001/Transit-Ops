import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  expiryDate: Date;
}

export function LicenseAlerts({ drivers }: { drivers: Driver[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-orange-500" /> License Expiry Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {drivers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming expirations</p>
        ) : (
          <div className="space-y-3">
            {drivers.slice(0, 5).map((driver) => (
              <div key={driver.id} className="text-sm">
                <p className="font-medium">{driver.name}</p>
                <p className="text-xs text-muted-foreground">
                  {driver.licenseNumber} • Expires {format(new Date(driver.expiryDate), "MMM d, yyyy")}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
