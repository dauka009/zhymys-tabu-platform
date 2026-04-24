import { query } from '@/lib/db';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

interface LogEntry {
  level: LogLevel;
  action: string;
  userId?: string;
  userRole?: string;
  resource?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ip?: string;
}

/**
 * Платформалық лог жазу функциясы.
 * Console-ге жазады + DB-дегі audit_logs кестесіне сақтайды.
 */
export async function log(entry: LogEntry): Promise<void> {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${entry.level}]`;

  // 1. Console-ге жазу (барлық деңгейлер)
  const consoleMsg = `${prefix} ${entry.action}${entry.userId ? ` | user=${entry.userId}` : ''}${entry.resource ? ` | resource=${entry.resource}${entry.resourceId ? ':' + entry.resourceId : ''}` : ''}`;

  if (entry.level === 'ERROR') {
    console.error(consoleMsg, entry.details || '');
  } else if (entry.level === 'WARN') {
    console.warn(consoleMsg, entry.details || '');
  } else {
    console.log(consoleMsg, entry.details || '');
  }

  // 2. DB-ге жазу (AUDIT деңгейі үшін)
  if (entry.level === 'AUDIT') {
    try {
      await query(
        `INSERT INTO audit_logs (user_id, action, table_name, record_id, metadata, ip_address)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          entry.userId || null,
          entry.action,
          entry.resource || null,
          entry.resourceId || null,
          entry.details ? JSON.stringify(entry.details) : null,
          entry.ip || null,
        ]
      );
    } catch (err) {
      // DB қатесі болса console-ге жаз, бірақ негізгі функционалды тоқтатпа
      console.error('[LOGGER] DB-ге лог жазу кезінде қате:', err);
    }
  }
}

/** Жылдам қолдануға арналған хелперлер */
export const logger = {
  info: (action: string, details?: Record<string, unknown>) =>
    log({ level: 'INFO', action, details }),

  warn: (action: string, details?: Record<string, unknown>) =>
    log({ level: 'WARN', action, details }),

  error: (action: string, details?: Record<string, unknown>) =>
    log({ level: 'ERROR', action, details }),

  audit: (action: string, entry: Omit<LogEntry, 'level' | 'action'>) =>
    log({ level: 'AUDIT', action, ...entry }),
};
