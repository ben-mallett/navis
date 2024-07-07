-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DataType" ADD VALUE 'NITRITES';
ALTER TYPE "DataType" ADD VALUE 'NITRATES';
ALTER TYPE "DataType" ADD VALUE 'AMMONIA';
ALTER TYPE "DataType" ADD VALUE 'ALKALINITY';
