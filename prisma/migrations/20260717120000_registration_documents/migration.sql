-- CreateTable
CREATE TABLE `registration_document_tbl` (
    `document_id` BIGINT NOT NULL AUTO_INCREMENT,
    `participant_id` BIGINT NOT NULL,
    `payment_id` BIGINT NULL,
    `event_id` BIGINT NULL,
    `type` ENUM('INVOICE', 'RECEIPT') NOT NULL,
    `document_number` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `status` ENUM('ISSUED', 'PAID', 'VOID') NOT NULL DEFAULT 'ISSUED',
    `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `registration_document_tbl_document_number_key`(`document_number`),
    INDEX `registration_document_tbl_participant_id_idx`(`participant_id`),
    INDEX `registration_document_tbl_payment_id_idx`(`payment_id`),
    INDEX `registration_document_tbl_type_idx`(`type`),
    INDEX `registration_document_tbl_status_idx`(`status`),
    INDEX `registration_document_tbl_issued_at_idx`(`issued_at`),
    PRIMARY KEY (`document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `registration_document_tbl` ADD CONSTRAINT `registration_document_tbl_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participant_registration_tbl`(`participant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registration_document_tbl` ADD CONSTRAINT `registration_document_tbl_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `payment_tbl`(`payment_id`) ON DELETE SET NULL ON UPDATE CASCADE;
