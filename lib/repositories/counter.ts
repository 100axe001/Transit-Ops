import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type Client = Prisma.TransactionClient | typeof prisma;

export const counterRepository = {
  /**
   * Atomically increment and return the next value for a sequence key.
   * Pass the transaction client when generating numbers inside a write
   * transaction so the increment and the row insert commit together.
   */
  async next(key: string, client: Client = prisma): Promise<number> {
    const counter = await client.counter.upsert({
      where: { key },
      create: { key, value: 1 },
      update: { value: { increment: 1 } },
    });
    return counter.value;
  },
};
