/*
  Warnings:

  - You are about to drop the column `description` on the `workflow` table. All the data in the column will be lost.
  - You are about to drop the column `edges` on the `workflow` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `workflow` table. All the data in the column will be lost.
  - You are about to drop the column `nodes` on the `workflow` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('INITIAL');

-- AlterTable
ALTER TABLE "workflow" DROP COLUMN "description",
DROP COLUMN "edges",
DROP COLUMN "isActive",
DROP COLUMN "nodes";

-- CreateTable
CREATE TABLE "node" (
    "id" TEXT NOT NULL,
    "workflowID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "NodeType" NOT NULL,
    "position" JSONB NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Connection" (
    "id" TEXT NOT NULL,
    "workflowID" TEXT NOT NULL,
    "fromNodeID" TEXT NOT NULL,
    "toNodeID" TEXT NOT NULL,
    "fromOutput" TEXT NOT NULL DEFAULT 'main',
    "toInput" TEXT NOT NULL DEFAULT 'main',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Connection_fromNodeID_toNodeID_fromOutput_toInput_key" ON "Connection"("fromNodeID", "toNodeID", "fromOutput", "toInput");

-- AddForeignKey
ALTER TABLE "node" ADD CONSTRAINT "node_workflowID_fkey" FOREIGN KEY ("workflowID") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_workflowID_fkey" FOREIGN KEY ("workflowID") REFERENCES "workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_fromNodeID_fkey" FOREIGN KEY ("fromNodeID") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Connection" ADD CONSTRAINT "Connection_toNodeID_fkey" FOREIGN KEY ("toNodeID") REFERENCES "node"("id") ON DELETE CASCADE ON UPDATE CASCADE;
