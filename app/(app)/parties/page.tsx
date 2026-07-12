import { partyService } from "@/lib/services";
import { requirePageAccess } from "@/lib/auth/guard";
import { PartiesClient } from "@/components/parties/parties-client";

interface Props {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function PartiesPage({ searchParams }: Props) {
  await requirePageAccess("parties:read");
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const { parties, total } = await partyService.list({
    search: params.search,
    page,
    pageSize: 20,
  });

  return <PartiesClient parties={parties} total={total} page={page} />;
}
