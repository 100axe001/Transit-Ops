// Report generation with chart visualization and CSV export
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { cn } from "@/lib/utils";
import { Download, Gauge, Activity, DollarSign, TrendingUp } from "lucide-react";
import Papa from "papaparse";

interface FuelEfficiencyItem {
  id: string;
  vehicle: string;
  distance: number;
  fuel: number;
  efficiency: number;
}

interface VehicleROIItem {
  id: string;
  name: string;
  registration: string;
  revenue: number;
  fuelCost: number;
  maintenanceCost: number;
  acquisitionCost: number;
  roi: number;
}

interface TripTrendItem {
  month: string;
  trips: number;
  revenue: number;
}

interface ExpenseItem {
  name: string;
  value: number;
}

interface Props {
  fleetUtilization: number;
  operationalCost: number;
  fuelEfficiency: FuelEfficiencyItem[];
  vehicleROI: VehicleROIItem[];
  tripTrends: TripTrendItem[];
  expenseBreakdown: ExpenseItem[];
}

function downloadCSV(data: unknown[], filename: string) {
  const csv = Papa.unparse(data as Record<string, unknown>[]);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export function ReportsClient({
  fleetUtilization,
  operationalCost,
  fuelEfficiency,
  vehicleROI,
  tripTrends,
  expenseBreakdown,
}: Props) {
  const avgEfficiency = fuelEfficiency.length
    ? fuelEfficiency.reduce((s, i) => s + i.efficiency, 0) / fuelEfficiency.length
    : 0;
  const avgROI = vehicleROI.length
    ? vehicleROI.reduce((s, i) => s + i.roi, 0) / vehicleROI.length
    : 0;
  const topCostliest = [...vehicleROI]
    .map((v) => ({ name: v.name, cost: v.fuelCost + v.maintenanceCost }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);
  const maxCost = topCostliest[0]?.cost || 1;

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Fleet analytics and operational reports" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Fuel Efficiency"
          value={`${avgEfficiency.toFixed(1)} km/L`}
          icon={Gauge}
          description="Avg across trips"
        />
        <StatCard
          title="Fleet Utilization"
          value={`${fleetUtilization.toFixed(1)}%`}
          icon={Activity}
          description="Vehicles on trips"
        />
        <StatCard
          title="Operational Cost"
          value={`$${operationalCost.toLocaleString()}`}
          icon={DollarSign}
          description="Fuel + maintenance + expenses"
        />
        <StatCard
          title="Vehicle ROI"
          value={`${avgROI.toFixed(1)}%`}
          icon={TrendingUp}
          description="Avg across fleet"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Costliest Vehicles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topCostliest.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No cost data yet
            </p>
          ) : (
            topCostliest.map((v, i) => (
              <div key={v.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{v.name}</span>
                  <span className="font-medium tabular-nums">
                    ${v.cost.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-2 rounded-full",
                      i === 0 ? "bg-rose-500" : i === 1 ? "bg-orange-500" : "bg-blue-500"
                    )}
                    style={{ width: `${Math.round((v.cost / maxCost) * 100)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="fuel">
        <TabsList>
          <TabsTrigger value="fuel">Fuel Efficiency</TabsTrigger>
          <TabsTrigger value="roi">Vehicle ROI</TabsTrigger>
          <TabsTrigger value="trips">Trip Trends</TabsTrigger>
          <TabsTrigger value="costs">Operational Costs</TabsTrigger>
        </TabsList>

        <TabsContent value="fuel" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Fuel Efficiency (km/L)</CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadCSV(fuelEfficiency, "fuel-efficiency")}>
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {fuelEfficiency.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No completed trips with fuel data</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={fuelEfficiency}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="vehicle" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="efficiency" fill="#22c55e" radius={[4, 4, 0, 0]} name="km/L" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Distance (km)</TableHead>
                        <TableHead>Fuel (L)</TableHead>
                        <TableHead>Efficiency (km/L)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fuelEfficiency.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.vehicle}</TableCell>
                          <TableCell>{item.distance.toFixed(1)}</TableCell>
                          <TableCell>{item.fuel.toFixed(1)}</TableCell>
                          <TableCell>{item.efficiency.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roi" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Vehicle ROI</CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadCSV(vehicleROI, "vehicle-roi")}>
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Registration</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Fuel Cost</TableHead>
                    <TableHead>Maint. Cost</TableHead>
                    <TableHead>Acq. Cost</TableHead>
                    <TableHead>ROI %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicleROI.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.registration}</TableCell>
                      <TableCell>${item.revenue.toLocaleString()}</TableCell>
                      <TableCell>${item.fuelCost.toLocaleString()}</TableCell>
                      <TableCell>${item.maintenanceCost.toLocaleString()}</TableCell>
                      <TableCell>${item.acquisitionCost.toLocaleString()}</TableCell>
                      <TableCell className={item.roi >= 0 ? "text-green-600" : "text-red-600"}>
                        {item.roi.toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Trip Trends</CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadCSV(tripTrends, "trip-trends")}>
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {tripTrends.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No trip data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tripTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="trips" stroke="#3b82f6" name="Trips" />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Operational Cost Breakdown</CardTitle>
              <Button variant="outline" size="sm" onClick={() => downloadCSV(expenseBreakdown, "operational-costs")}>
                <Download className="h-4 w-4 mr-2" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              {expenseBreakdown.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">No expense data yet</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={expenseBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} name="Cost ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseBreakdown.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>${item.value.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
