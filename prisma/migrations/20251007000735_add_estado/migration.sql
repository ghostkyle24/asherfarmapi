-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('ATIVA', 'CAIDA', 'RESTABELECENDO');

-- AlterTable
ALTER TABLE "Conta" ADD COLUMN     "estado" "Estado" DEFAULT 'ATIVA';
