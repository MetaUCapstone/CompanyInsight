-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "exchange" DROP NOT NULL,
ALTER COLUMN "assetType" DROP NOT NULL,
ALTER COLUMN "ipoDate" DROP NOT NULL,
ALTER COLUMN "ipoDate" SET DATA TYPE TEXT,
ALTER COLUMN "delistingDate" DROP NOT NULL,
ALTER COLUMN "delistingDate" SET DATA TYPE TEXT,
ALTER COLUMN "status" DROP NOT NULL;
