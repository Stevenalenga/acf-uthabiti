ALTER TABLE `participant_logbook_tbl` ADD COLUMN `is_speaker` BOOLEAN NOT NULL DEFAULT false;
UPDATE `participant_logbook_tbl` SET `is_speaker` = true WHERE LOWER(`role`) LIKE '%speaker%';
