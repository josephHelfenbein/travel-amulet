/*
  Warnings:

  - Added the required column `country` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `id` BIGINT NOT NULL AUTO_INCREMENT;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `country` VARCHAR(2) NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL;
