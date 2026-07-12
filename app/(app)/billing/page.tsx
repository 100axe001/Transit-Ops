import { billingService, partyService } from "@/lib/services";
import { requirePageAccess } from "@/lib/auth/guard";
import { BillingClient } from "@/components/billing/billing-client";

interface Props {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function BillingPage({ searchParams }: Props) {
  await requirePageAccess("billing:read");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const [{ biltys, total }, parties] = await Promise.all([
    billingService.listBiltys({ search: params.search, page, pageSize: 20 }),
    partyService.options(),
  ]);

  return <BillingClient biltys={biltys} total={total} page={page} parties={parties} />;
}
