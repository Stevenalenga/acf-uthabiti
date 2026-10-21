CREATE TABLE `participant_logbook_tbl` (
    `logbook_id` BIGINT NOT NULL AUTO_INCREMENT,
    `participant_id` BIGINT NULL,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `organization` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `bio` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `participant_logbook_tbl_email_key`(`email`),
    INDEX `participant_logbook_tbl_participant_id_idx`(`participant_id`),
    INDEX `participant_logbook_tbl_full_name_idx`(`full_name`),
    PRIMARY KEY (`logbook_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
