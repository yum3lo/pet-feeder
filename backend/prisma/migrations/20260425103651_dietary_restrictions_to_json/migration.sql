-- Clear non-JSON values so MySQL can safely cast the column type
UPDATE `Pet` SET `dietaryRestrictions` = NULL WHERE `dietaryRestrictions` IS NOT NULL;

-- AlterTable
ALTER TABLE `Pet` MODIFY `dietaryRestrictions` JSON NULL;
