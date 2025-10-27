/*
  Warnings:

  - You are about to drop the column `createdBy` on the `quiz` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Quiz` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `Quiz_createdBy_fkey`;

-- DropIndex
DROP INDEX `Quiz_createdBy_fkey` ON `quiz`;

-- AlterTable
ALTER TABLE `quiz` DROP COLUMN `createdBy`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
