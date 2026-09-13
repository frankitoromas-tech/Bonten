-- =======================================================================
-- BONTEN ENTERPRISE SCHEMA - FLYWAY MIGRATION V1__init_schema.sql
-- Compatible con PostgreSQL 15+ y MySQL 8.x
-- =======================================================================

-- 1. Tabla de Usuarios y Miembros de la Comunidad
CREATE TABLE IF NOT EXISTS bonten_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    password_salt VARCHAR(64) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'ROLE_MEMBER', -- 'ROLE_MEMBER', 'ROLE_ADMIN', 'ROLE_SUPERADMIN'
    avatar_url VARCHAR(255) DEFAULT '/assets/fireboy_client.webp',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON bonten_users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON bonten_users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON bonten_users(role);

-- 2. Tokens de Restablecimiento de Contraseña (OWASP: Hashed Tokens)
CREATE TABLE IF NOT EXISTS bonten_password_resets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES bonten_users(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE, -- Hash SHA-256 del token plano
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(45) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pwd_resets_token_hash ON bonten_password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_pwd_resets_user_id ON bonten_password_resets(user_id);

-- 3. Argumentos y Comentarios en Debates Doctrinales
CREATE TABLE IF NOT EXISTS bonten_debate_arguments (
    id BIGSERIAL PRIMARY KEY,
    debate_id INT NOT NULL,
    user_id BIGINT NOT NULL REFERENCES bonten_users(id) ON DELETE CASCADE,
    stance VARCHAR(10) NOT NULL CHECK (stance IN ('pro', 'contra')),
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_debate_args_debate_id ON bonten_debate_arguments(debate_id);
CREATE INDEX IF NOT EXISTS idx_debate_args_user_id ON bonten_debate_arguments(user_id);
