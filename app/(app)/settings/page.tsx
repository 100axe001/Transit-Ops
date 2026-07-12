import { requirePageAccess } from "@/lib/auth/guard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { AppearanceCard } from "@/components/settings/appearance-card";
import { GeneralSettings } from "@/components/settings/general-settings";
import { RbacMatrix } from "@/components/settings/rbac-matrix";

export default async function SettingsPage() {
  const session = await requirePageAccess("settings:read");
  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-base font-medium">{session.name}</p>
              <p className="text-sm text-muted-foreground">{session.email}</p>
              <Badge variant="secondary">
                {session.role.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <AppearanceCard />

      <div className="grid gap-6 lg:grid-cols-2">
        <GeneralSettings />
        <RbacMatrix />
      </div>
    </div>
  );
}
