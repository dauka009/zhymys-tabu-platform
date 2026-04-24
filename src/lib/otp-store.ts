/**
 * Серверде уақытша OTP кодтарды сақтайтын жер (In-memory).
 * Production-да Redis немесе DB қолданыңыз.
 */

interface OtpEntry {
  code: string;
  expiresAt: number; // timestamp ms
}

// Global сақтауыш (Next.js dev hot-reload-ке төзімді)
const globalStore = global as unknown as { otpStore: Map<string, OtpEntry> };

if (!globalStore.otpStore) {
  globalStore.otpStore = new Map();
}

export const otpStore = globalStore.otpStore;

/** 6 таңбалы кездейсоқ код жасайды */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** OTP сақтайды (5 минут жарамды) */
export function saveOTP(email: string, code: string) {
  otpStore.set(email.toLowerCase(), {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 мин
  });
}

/** OTP тексереді. deleteAfter=true болса — дұрыс болса жояды  */
export function verifyOTP(email: string, code: string, deleteAfter = true): boolean {
  const entry = otpStore.get(email.toLowerCase());
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  if (entry.code !== code) return false;
  if (deleteAfter) otpStore.delete(email.toLowerCase());
  return true;
}
