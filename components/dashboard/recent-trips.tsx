import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { Route } from "lucide-react";

interface Trip {
  id: string;
  source: string;
  destination: string;
  status: string;
  vehicle: { vehicleName: string };
  driver: { name: string };
}

export function RecentTrips({ trips }: { trips: Trip[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Route className="h-4 w-4" /> Recent Trips
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trips.length === 0 ? (
          <p className="text-sm text-muted-foreground">No trips yet</p>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <div key={trip.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{trip.source} → {trip.destination}</p>
                  <p className="text-xs text-muted-foreground">
                    {trip.vehicle.vehicleName} • {trip.driver.name}
                  </p>
                </div>
                <StatusBadge status={trip.status} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
