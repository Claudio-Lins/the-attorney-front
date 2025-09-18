-- AlterTable
ALTER TABLE "client" ADD COLUMN     "whatsapp" TEXT,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- CreateTable
CREATE TABLE "lead" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "whatsapp" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "qualified" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,

    CONSTRAINT "lead_pkey" PRIMARY KEY ("id")
);
