/*
  Warnings:

  - A unique constraint covering the columns `[email,event_id]` on the table `participant_registration_tbl` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `participant_registration_tbl` ADD COLUMN `event_id` BIGINT NULL;

-- CreateTable
CREATE TABLE `event_tbl` (
    `event_id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `event_tbl_code_key`(`code`),
    PRIMARY KEY (`event_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `participant_registration_tbl_event_id_idx` ON `participant_registration_tbl`(`event_id`);

-- CreateIndex
CREATE UNIQUE INDEX `participant_registration_tbl_email_event_id_key` ON `participant_registration_tbl`(`email`, `event_id`);

-- AddForeignKey
ALTER TABLE `participant_registration_tbl` ADD CONSTRAINT `participant_registration_tbl_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `event_tbl`(`event_id`) ON DELETE SET NULL ON UPDATE CASCADE;
