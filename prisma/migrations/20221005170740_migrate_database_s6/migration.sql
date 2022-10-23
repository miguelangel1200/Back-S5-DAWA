/*
  Warnings:

  - Added the required column `sender_id` to the `message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_user_id_fkey`;

-- AlterTable
ALTER TABLE `message` ADD COLUMN `sender_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
