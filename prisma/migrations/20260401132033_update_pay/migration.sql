/*
  Warnings:

  - You are about to drop the column `payment_reference` on the `participant_registration_tbl` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `participant_registration_tbl_payment_reference_idx` ON `participant_registration_tbl`;

-- AlterTable
ALTER TABLE `participant_registration_tbl` DROP COLUMN `payment_reference`;
