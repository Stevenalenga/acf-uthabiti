-- CreateTable
CREATE TABLE `NewsletterSubscriber` (
    `email_id` BIGINT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `isSubscribed` BOOLEAN NOT NULL DEFAULT true,
    `unsubscribeToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    UNIQUE INDEX `NewsletterSubscriber_unsubscribeToken_key`(`unsubscribeToken`),
    INDEX `NewsletterSubscriber_email_idx`(`email`),
    PRIMARY KEY (`email_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
