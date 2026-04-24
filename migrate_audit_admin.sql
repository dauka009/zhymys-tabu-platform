-- ================================================================
-- audit_logs кестесін жасау (егер жоқ болса)
-- pgAdmin > Query Tool ішінде орындаңыз
-- ================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  user_role   VARCHAR(20),
  action      VARCHAR(200) NOT NULL,
  resource    VARCHAR(100),
  resource_id VARCHAR(200),
  details     JSONB,
  ip          VARCHAR(50),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Индекс: жылдам іздеу үшін
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ================================================================
-- users кестесіндегі role enum-ына ADMIN қосу (егер жоқ болса)
-- ================================================================

-- Алдымен enum мәнін тексеріп қосамыз
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'ADMIN'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role')
  ) THEN
    ALTER TYPE user_role ADD VALUE 'ADMIN';
    RAISE NOTICE '✅ ADMIN рөлі enum-ға қосылды';
  ELSE
    RAISE NOTICE 'ℹ️ ADMIN рөлі бұрыннан бар';
  END IF;
END $$;

-- ================================================================
-- Seed-тегі admin пайдаланушының рөлін түзету
-- ================================================================
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@jumystap.kz';

-- Тексеру
SELECT 'AUDIT_LOGS' as кесте, COUNT(*) as саны FROM audit_logs
UNION ALL
SELECT 'ADMIN_USERS', COUNT(*) FROM users WHERE role = 'ADMIN';
