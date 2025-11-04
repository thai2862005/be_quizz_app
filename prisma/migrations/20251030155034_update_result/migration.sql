/*
  Warnings:

  - Added the required column `sum` to the `results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `results` ADD COLUMN `sum` INTEGER NOT NULL;
