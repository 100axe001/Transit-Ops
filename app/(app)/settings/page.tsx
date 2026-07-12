import { requirePageAccess } from "@/lib/auth/guard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

export default async function SettingsPage() {
  const session = await requirePageAccess("settings:read");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account and preferences" />
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-sm">{session?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{session?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-sm">{session?.role.replace("_", " ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
