import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

interface MaintenanceRecord {
  id: string;
  title: string;
  vehicle: { vehicleName: string; registrationNumber: string };
  openedAt: Date;
}

export function MaintenanceAlerts({ records }: { records: MaintenanceRecord[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wrench className="h-4 w-4" /> Vehicles Under Maintenance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {records.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active maintenance</p>
        ) : (
          <div className="space-y-3">
            {records.slice(0, 5).map((record) => (
              <div key={record.id} className="text-sm">
                <p className="font-medium">{record.vehicle.vehicleName}</p>
                <p className="text-xs text-muted-foreground">
                  {record.title} • {record.vehicle.registrationNumber}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
