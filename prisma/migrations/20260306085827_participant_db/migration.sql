-- CreateTable
CREATE TABLE `participant_registration_tbl` (
    `participant_id` BIGINT NOT NULL AUTO_INCREMENT,
    `full_name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `organization` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `profession` VARCHAR(191) NOT NULL,
    `other_profession` VARCHAR(191) NULL,
    `visa_info` VARCHAR(191) NULL,
    `phase` ENUM('EarlyBird', 'Regular', 'LateOnsite') NOT NULL,
    `type` ENUM('student', 'eastAfrica', 'other') NOT NULL,
    `other_accessibility` VARCHAR(191) NULL,
    `required_translation` VARCHAR(191) NULL,
    `other_dietary_restrictions` VARCHAR(191) NULL,
    `media_consent` VARCHAR(191) NOT NULL,
    `report_consent` VARCHAR(191) NOT NULL,
    `emergency_contact` VARCHAR(191) NULL,
    `paid` BOOLEAN NOT NULL DEFAULT false,
    `payment_reference` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `participant_registration_tbl_email_idx`(`email`),
    INDEX `participant_registration_tbl_phase_idx`(`phase`),
    INDEX `participant_registration_tbl_type_idx`(`type`),
    INDEX `participant_registration_tbl_payment_reference_idx`(`payment_reference`),
    PRIMARY KEY (`participant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registration_accessibility_tbl` (
    `accessibility_id` BIGINT NOT NULL AUTO_INCREMENT,
    `participant_id` BIGINT NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    INDEX `registration_accessibility_tbl_participant_id_idx`(`participant_id`),
    PRIMARY KEY (`accessibility_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `registration_dietary_tbl` (
    `dietary_id` BIGINT NOT NULL AUTO_INCREMENT,
    `participant_id` BIGINT NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    INDEX `registration_dietary_tbl_participant_id_idx`(`participant_id`),
    PRIMARY KEY (`dietary_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_tbl` (
    `payment_id` BIGINT NOT NULL AUTO_INCREMENT,
    `participant_id` BIGINT NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'USD',
    `method` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL,
    `payment_reference` VARCHAR(191) NOT NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `payment_tbl_participant_id_idx`(`participant_id`),
    INDEX `payment_tbl_status_idx`(`status`),
    INDEX `payment_tbl_payment_reference_idx`(`payment_reference`),
    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `registration_accessibility_tbl` ADD CONSTRAINT `registration_accessibility_tbl_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participant_registration_tbl`(`participant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `registration_dietary_tbl` ADD CONSTRAINT `registration_dietary_tbl_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participant_registration_tbl`(`participant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_tbl` ADD CONSTRAINT `payment_tbl_participant_id_fkey` FOREIGN KEY (`participant_id`) REFERENCES `participant_registration_tbl`(`participant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
