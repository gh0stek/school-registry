-- DropForeignKey
ALTER TABLE `StudentGrade` DROP FOREIGN KEY `StudentGrade_studentId_fkey`;

-- DropForeignKey
ALTER TABLE `StudentGrade` DROP FOREIGN KEY `StudentGrade_subjectId_fkey`;

-- AddForeignKey
ALTER TABLE `StudentGrade` ADD CONSTRAINT `StudentGrade_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Student`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentGrade` ADD CONSTRAINT `StudentGrade_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `Subject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
