/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `stock` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `books` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `country` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `balance` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `books` MODIFY `stock` INTEGER NOT NULL DEFAULT 0,
    MODIFY `price` DECIMAL(15, 2) NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `country` VARCHAR(2) NOT NULL,
    ADD COLUMN `email` VARCHAR(255) NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL,
    ADD COLUMN `password` VARCHAR(255) NOT NULL,
    MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT,
    MODIFY `balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.0;

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);
