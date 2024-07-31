/*
  Warnings:

  - Made the column `stock` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `balance` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `books` MODIFY `stock` INTEGER NOT NULL DEFAULT 0,
    MODIFY `price` DECIMAL(15, 2) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `password` VARCHAR(255) NOT NULL,
    MODIFY `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.0;
