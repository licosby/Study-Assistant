import { HistoryItem, StudyNote, MnemonicItem, Question } from '../types';

export interface UserSessionData {
  username: string;
  displayName: string;
  history: HistoryItem[];
  notes: StudyNote[];
  mnemonics: MnemonicItem[];
  stats: {
    totalAnswered: number;
    totalCorrect: number;
    subjectStats: Record<string, { answered: number; correct: number }>;
  };
  lastActive: number;
}

const LOCAL_STORAGE_KEY = 'clep_scholar_user_session';

export async function loginUser(name: string, username: string, password?: string): Promise<UserSessionData> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.user));
      return data.user;
    }
  } catch (err) {
    console.warn('Network auth failed, falling back to local storage session', err);
  }

  // Local fallback
  const existing = getStoredUserSession();
  const fallbackUser: UserSessionData = {
    username: username.trim().toLowerCase(),
    displayName: name.trim() || username.trim(),
    history: existing?.username === username.trim().toLowerCase() ? existing.history : [],
    notes: existing?.username === username.trim().toLowerCase() ? existing.notes : [],
    mnemonics: existing?.username === username.trim().toLowerCase() ? existing.mnemonics : [],
    stats: existing?.username === username.trim().toLowerCase() ? existing.stats : { totalAnswered: 0, totalCorrect: 0, subjectStats: {} },
    lastActive: Date.now(),
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackUser));
  return fallbackUser;
}

export async function syncUserData(session: UserSessionData): Promise<void> {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));

  try {
    await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(session),
    });
  } catch (err) {
    console.warn('Sync failed (will retry next time):', err);
  }
}

export function getStoredUserSession(): UserSessionData | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading localStorage session:', err);
  }
  return null;
}

export async function fetchAIQuestions(
  subjectName: string,
  chapter: string,
  textbook: string,
  count = 3
): Promise<Question[]> {
  try {
    const res = await fetch('/api/ai/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subjectName, chapter, textbook, count }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.questions || [];
    }
  } catch (err) {
    console.warn('AI question generation offline, using textbook core bank', err);
  }
  return [];
}

export interface GeneratedMnemonic {
  phrase: string;
  style?: 'acronym' | 'acrostic' | 'rhyme' | 'visual_hook';
  breakdown: string[];
  explanation: string;
  retrievalCue?: string;
  recallQuestion?: string;
  recallAnswer?: string;
}

export async function generateAIMnemonic(
  concept: string,
  subjectName: string,
  chapter: string,
  style: 'acronym' | 'acrostic' | 'rhyme' | 'visual_hook' = 'acronym'
): Promise<GeneratedMnemonic | null> {
  try {
    const res = await fetch('/api/ai/mnemonic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ concept, subjectName, chapter, style }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.mnemonic;
    }
  } catch (err) {
    console.warn('AI Mnemonic endpoint unavailable', err);
  }
  return null;
}

export async function fetchAIDeepExplanation(
  question: string,
  selectedOptionText: string,
  correctOptionText: string,
  textbookRef: string
): Promise<string | null> {
  try {
    const res = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, selectedOptionText, correctOptionText, textbookRef }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.deepExplanation;
    }
  } catch (err) {
    console.warn('AI Explain endpoint unavailable', err);
  }
  return null;
}
