-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('nuevo', 'seminuevo');

-- AlterTable
ALTER TABLE "products" ADD COLUMN "condition" "Condition" NOT NULL DEFAULT 'nuevo';
