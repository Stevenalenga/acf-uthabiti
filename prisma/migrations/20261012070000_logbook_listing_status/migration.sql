ALTER TABLE `participant_logbook_tbl`
  ADD COLUMN `status` ENUM('PENDING', 'PUBLISHED', 'REJECTED') NOT NULL DEFAULT 'PUBLISHED';
CREATE INDEX `participant_logbook_tbl_status_idx` ON `participant_logbook_tbl`(`status`);
