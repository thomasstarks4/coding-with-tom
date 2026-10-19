-- FamTalk MySQL schema (Hostinger)
-- Charset utf8mb4 for emoji. Run once in phpMyAdmin or mysql CLI.
-- Safe to re-run: uses IF NOT EXISTS.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS ft_users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  username VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_users_email (email),
  UNIQUE KEY uq_ft_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ft_auth_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME(3) NOT NULL,
  created_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_auth_tokens_hash (token_hash),
  KEY idx_ft_auth_tokens_user (user_id),
  KEY idx_ft_auth_tokens_expires (expires_at),
  CONSTRAINT fk_ft_auth_tokens_user
    FOREIGN KEY (user_id) REFERENCES ft_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ft_families (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  invite_code VARCHAR(16) NOT NULL,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_families_invite (invite_code),
  KEY idx_ft_families_created_by (created_by),
  CONSTRAINT fk_ft_families_created_by
    FOREIGN KEY (created_by) REFERENCES ft_users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ft_family_members (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  family_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  role ENUM('admin', 'member') NOT NULL DEFAULT 'member',
  joined_at DATETIME(3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_family_members (family_id, user_id),
  KEY idx_ft_family_members_user (user_id),
  CONSTRAINT fk_ft_family_members_family
    FOREIGN KEY (family_id) REFERENCES ft_families (id) ON DELETE CASCADE,
  CONSTRAINT fk_ft_family_members_user
    FOREIGN KEY (user_id) REFERENCES ft_users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ft_messages (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  family_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  body TEXT NOT NULL,
  client_id VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  deleted_at DATETIME(3) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_messages_client (family_id, client_id),
  KEY idx_ft_messages_sync (family_id, updated_at),
  KEY idx_ft_messages_deleted (family_id, deleted_at),
  CONSTRAINT fk_ft_messages_family
    FOREIGN KEY (family_id) REFERENCES ft_families (id) ON DELETE CASCADE,
  CONSTRAINT fk_ft_messages_user
    FOREIGN KEY (user_id) REFERENCES ft_users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ft_notes (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  family_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL DEFAULT '',
  body MEDIUMTEXT NOT NULL,
  client_id VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  deleted_at DATETIME(3) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_notes_client (family_id, client_id),
  KEY idx_ft_notes_sync (family_id, updated_at),
  CONSTRAINT fk_ft_notes_family
    FOREIGN KEY (family_id) REFERENCES ft_families (id) ON DELETE CASCADE,
  CONSTRAINT fk_ft_notes_user
    FOREIGN KEY (user_id) REFERENCES ft_users (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ft_lists (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  family_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(200) NOT NULL,
  client_id VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  deleted_at DATETIME(3) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_lists_client (family_id, client_id),
  KEY idx_ft_lists_sync (family_id, updated_at),
  CONSTRAINT fk_ft_lists_family
    FOREIGN KEY (family_id) REFERENCES ft_families (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ft_list_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  list_id BIGINT UNSIGNED NOT NULL,
  family_id BIGINT UNSIGNED NOT NULL,
  text VARCHAR(500) NOT NULL,
  checked TINYINT(1) NOT NULL DEFAULT 0,
  qty VARCHAR(64) NULL,
  category VARCHAR(32) NULL,
  assignee_user_id BIGINT UNSIGNED NULL,
  client_id VARCHAR(64) NULL,
  created_at DATETIME(3) NOT NULL,
  updated_at DATETIME(3) NOT NULL,
  deleted_at DATETIME(3) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ft_list_items_client (family_id, client_id),
  KEY idx_ft_list_items_sync (family_id, updated_at),
  KEY idx_ft_list_items_list (list_id),
  CONSTRAINT fk_ft_list_items_list
    FOREIGN KEY (list_id) REFERENCES ft_lists (id) ON DELETE CASCADE,
  CONSTRAINT fk_ft_list_items_family
    FOREIGN KEY (family_id) REFERENCES ft_families (id) ON DELETE CASCADE,
  CONSTRAINT fk_ft_list_items_assignee
    FOREIGN KEY (assignee_user_id) REFERENCES ft_users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
