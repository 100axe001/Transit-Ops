-- CreateEnum
CREATE TYPE "PartyType" AS ENUM ('CONSIGNOR', 'CONSIGNEE', 'BOTH');

-- CreateEnum
CREATE TYPE "BiltyStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CHALLAN_DONE', 'DELIVERED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('CASH', 'UPI', 'BANK_TRANSFER');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gst" TEXT,
    "pan" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "branch" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Party" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PartyType" NOT NULL DEFAULT 'BOTH',
    "gst" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Party_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bilty" (
    "id" TEXT NOT NULL,
    "biltyNumber" TEXT NOT NULL,
    "tripId" TEXT,
    "consignorId" TEXT NOT NULL,
    "consigneeId" TEXT NOT NULL,
    "fromLocation" TEXT NOT NULL,
    "toLocation" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "goodsDesc" TEXT NOT NULL,
    "packages" INTEGER NOT NULL,
    "packingMethod" TEXT,
    "actualWeight" DOUBLE PRECISION NOT NULL,
    "chargedWeight" DOUBLE PRECISION NOT NULL,
    "grNumber" TEXT,
    "privateMark" TEXT,
    "remarks" TEXT,
    "labourCharge" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "grCharge" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "doorDelivery" DOUBLE PRECISION,
    "pfCharge" DOUBLE PRECISION,
    "serviceTax" DOUBLE PRECISION,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "insurance" TEXT NOT NULL DEFAULT 'Owner''s Risk',
    "status" "BiltyStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bilty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "biltyId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mode" "PaymentMode" NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "biltyId" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paid" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bilty_biltyNumber_key" ON "Bilty"("biltyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Bilty_tripId_key" ON "Bilty"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Counter_key_key" ON "Counter"("key");

-- AddForeignKey
ALTER TABLE "Bilty" ADD CONSTRAINT "Bilty_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bilty" ADD CONSTRAINT "Bilty_consignorId_fkey" FOREIGN KEY ("consignorId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bilty" ADD CONSTRAINT "Bilty_consigneeId_fkey" FOREIGN KEY ("consigneeId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_biltyId_fkey" FOREIGN KEY ("biltyId") REFERENCES "Bilty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_biltyId_fkey" FOREIGN KEY ("biltyId") REFERENCES "Bilty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
