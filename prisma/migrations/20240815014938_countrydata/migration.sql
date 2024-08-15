-- CreateTable
CREATE TABLE `CountryData` (
    `id` VARCHAR(2) NOT NULL,
    `description` LONGBLOB NOT NULL,
    `climate` LONGBLOB NOT NULL,
    `currency` LONGBLOB NOT NULL,
    `cuisine` LONGBLOB NOT NULL,
    `language` LONGBLOB NOT NULL,
    `culture` LONGBLOB NOT NULL,
    `politics` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
