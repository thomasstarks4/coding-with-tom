-- FamTalk: Expo push token storage (run once in phpMyAdmin if schema.sql already applied)

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS ft_push_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  expo_push_token VARCHAR(255) NOT NULL,
  platform VARCHAR(16) NOT NULL DEFAULT 'android',
  updated_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_push_tokens_token (expo_push_token),
  KEY idx_ft_push_tokens_user (user_id),
  CONSTRAINT fk_ft_push_tokens_user
    FOREIGN KEY (user_id) REFERENCES ft_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
