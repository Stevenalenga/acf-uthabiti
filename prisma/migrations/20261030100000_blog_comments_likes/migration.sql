-- CreateTable
CREATE TABLE `blog_comment_tbl` (
    `comment_id` BIGINT NOT NULL AUTO_INCREMENT,
    `blog_slug` VARCHAR(120) NOT NULL,
    `author` VARCHAR(80) NOT NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `blog_comment_tbl_blog_slug_createdAt_idx`(`blog_slug`, `createdAt`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_like_tbl` (
    `like_id` BIGINT NOT NULL AUTO_INCREMENT,
    `blog_slug` VARCHAR(120) NOT NULL,
    `visitor_id` VARCHAR(64) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `blog_like_tbl_blog_slug_visitor_id_key`(`blog_slug`, `visitor_id`),
    PRIMARY KEY (`like_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
