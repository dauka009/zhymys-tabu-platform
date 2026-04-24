-- ================================================================
-- ЖұмысТап — Seed деректер (нақты схемаға сай)
-- pgAdmin > Query Tool ішінде орындаңыз
-- ================================================================

-- Ескілерді тазалаймыз
DELETE FROM vacancies WHERE slug IN (
  'senior-react-developer','product-manager','data-analyst',
  'ux-ui-designer','buhgalter','devops-engineer','smm-manager','backend-go-developer'
);
DELETE FROM companies WHERE slug IN (
  'kaspi-kz','kolesa-group','air-astana','magnum-kz','halyk-bank'
);
DELETE FROM users WHERE email = 'admin@jumystap.kz';

-- ================================================================
-- 1) ADMIN ПАЙДАЛАНУШЫ
-- ================================================================
INSERT INTO users (email, password_hash, first_name, last_name, full_name, role, status)
VALUES ('admin@jumystap.kz', 'admin123', 'Admin', 'JumysTap', 'Admin JumysTap', 'ADMIN', 'ACTIVE');

-- ================================================================
-- 2) КОМПАНИЯЛАР мен ВАКАНСИЯЛАР
-- ================================================================
DO $$
DECLARE
  admin_id  UUID;
  comp1_id  UUID;
  comp2_id  UUID;
  comp3_id  UUID;
  comp4_id  UUID;
  comp5_id  UUID;
BEGIN
  SELECT id INTO admin_id FROM users WHERE email = 'admin@jumystap.kz' LIMIT 1;

  -- Kaspi.kz
  INSERT INTO companies (owner_user_id, slug, legal_name, display_name, logo_url)
  VALUES (admin_id, 'kaspi-kz', 'Kaspi.kz LLP', 'Kaspi.kz', 'https://kaspi.kz/favicon.ico')
  RETURNING id INTO comp1_id;

  -- Kolesa Group
  INSERT INTO companies (owner_user_id, slug, legal_name, display_name, logo_url)
  VALUES (admin_id, 'kolesa-group', 'Kolesa Group LLP', 'Kolesa Group', 'https://kolesa.kz/favicon.ico')
  RETURNING id INTO comp2_id;

  -- Air Astana
  INSERT INTO companies (owner_user_id, slug, legal_name, display_name, logo_url)
  VALUES (admin_id, 'air-astana', 'Air Astana JSC', 'Air Astana', 'https://airastana.com/favicon.ico')
  RETURNING id INTO comp3_id;

  -- Magnum
  INSERT INTO companies (owner_user_id, slug, legal_name, display_name, logo_url)
  VALUES (admin_id, 'magnum-kz', 'Magnum Cash&Carry LLP', 'Magnum', 'https://magnum.kz/favicon.ico')
  RETURNING id INTO comp4_id;

  -- Halyk Bank
  INSERT INTO companies (owner_user_id, slug, legal_name, display_name, logo_url)
  VALUES (admin_id, 'halyk-bank', 'Halyk Bank JSC', 'Halyk Bank', 'https://halykbank.kz/favicon.ico')
  RETURNING id INTO comp5_id;

  -- ================================================================
  -- 3) ВАКАНСИЯЛАР
  -- ================================================================

  INSERT INTO vacancies (company_id, slug, title, description, employment_type, work_mode, salary_min, salary_max, currency, status)
  VALUES (comp1_id, 'senior-react-developer', 'Senior React/Next.js Developer',
    'Kaspi өнімдерін дамытатын командаға тәжірибелі React маман іздейміз. React 18+, Next.js 14, TypeScript.',
    'FULL_TIME', 'HYBRID', 1200000, 1800000, 'KZT', 'PUBLISHED');

  INSERT INTO vacancies (company_id, slug, title, description, employment_type, work_mode, salary_min, salary_max, currency, status)
  VALUES (comp2_id, 'product-manager', 'Product Manager',
    'Kolesa.kz платформасының жаңа мүмкіндіктерін басқару. Agile/Scrum, A/B testing, Jira.',
    'FULL_TIME', 'REMOTE', 900000, 1200000, 'KZT', 'PUBLISHED');

  INSERT INTO vacancies (company_id, slug, title, description, employment_type, work_mode, salary_min, salary_max, currency, status)
  VALUES (comp3_id, 'data-analyst', 'Data Analyst',
    'Авиация саласындағы деректерді талдау. SQL, Python, Power BI, аналитикалық ойлау.',
    'FULL_TIME', 'ONSITE', 700000, 900000, 'KZT', 'PUBLISHED');

  INSERT INTO vacancies (company_id, slug, title, description, employment_type, work_mode, salary_min, salary_max, currency, status)
  VALUES (comp4_id, 'ux-ui-designer', 'UX/UI Designer',
    'Magnum мобильді қосымшасының дизайнын жақсарту. Figma, UI/UX принциптері, Прототиптеу.',
    'PART_TIME', 'ONSITE', 600000, 850000, 'KZT', 'PUBLISHED');

  INSERT INTO vacancies (company_id, slug, title, description, employment_type, work_mode, salary_min, salary_max, currency, status)
  VALUES (comp5_id, 'buhgalter', 'Бухгалтер',
    'Банк саласындағы бухгалтерлік есепті жүргізу. 1С Бухгалтерия, Қаржылық заңнама, Excel.',
    'FULL_TIME', 'ONSITE', 400000, 550000, 'KZT', 'PUBLISHED');

  INSERT INTO vacancies (company_id, slug, title, description, employment_type, work_mode, salary_min, salary_max, currency, status)
  VALUES (comp1_id, 'devops-engineer', 'DevOps Engineer',
    'Инфрақұрылымды басқару және CI/CD процестерін оңтайландыру. Kubernetes, Docker, GitLab CI.',
    'FULL_TIME', 'HYBRID', 1400000, NULL, 'KZT', 'PUBLISHED');

  INSERT INTO vacancies (company_id, slug, title, description, employment_type, work_mode, salary_min, salary_max, currency, status)
  VALUES (comp4_id, 'smm-manager', 'SMM Manager',
    'Magnum әлеуметтік желілерін жүргізу (Instagram, TikTok). Копирайтинг, Мобилография.',
    'FULL_TIME', 'ONSITE', 350000, 500000, 'KZT', 'PUBLISHED');

  INSERT INTO vacancies (company_id, slug, title, description, employment_type, work_mode, salary_min, salary_max, currency, status)
  VALUES (comp2_id, 'backend-go-developer', 'Backend Go Developer',
    'Highload жобалар үшін микросервистер әзірлеу. Golang, PostgreSQL, Redis, gRPC, Kafka.',
    'FULL_TIME', 'REMOTE', 1000000, 1500000, 'KZT', 'PUBLISHED');

  RAISE NOTICE '✅ Сәтті: 5 компания, 8 вакансия енгізілді!';
END $$;

-- ================================================================
-- 4) ТЕКСЕРУ
-- ================================================================
SELECT 'COMPANIES' as кесте, COUNT(*) as саны FROM companies
UNION ALL
SELECT 'VACANCIES', COUNT(*) FROM vacancies
UNION ALL
SELECT 'USERS', COUNT(*) FROM users;
