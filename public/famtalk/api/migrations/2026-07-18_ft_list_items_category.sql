-- FamTalk: aisle/category on grocery list items (run once if schema already applied)

SET NAMES utf8mb4;
SET time_zone = '+00:00';

ALTER TABLE ft_list_items
  ADD COLUMN category VARCHAR(32) NULL AFTER qty;
