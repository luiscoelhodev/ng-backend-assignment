/*
  Warnings:

  - A unique constraint covering the columns `[account_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "account_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_account_id_key" ON "users"("account_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
