ALTER TABLE `dinner_booking_tbl`
  ADD COLUMN `kind` VARCHAR(191) NOT NULL DEFAULT 'tamarind',
  ADD COLUMN `notes` TEXT NULL;
CREATE INDEX `dinner_booking_tbl_kind_idx` ON `dinner_booking_tbl`(`kind`);
