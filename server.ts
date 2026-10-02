import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(express.json({ limit: '10mb' }));

// Ensure database file exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface UserRecord {
  username: string;
  displayName: string;
  password?: string;
  history: any[];
  notes: any[];
  mnemonics: any[];
  stats: {
    totalAnswered: number;
    totalCorrect: number;
    subjectStats: Record<string, { answered: number; correct: number }>;
  };
  lastActive: number;
}

interface Database {
  users: Record<string, UserRecord>;
}

function readDb(): Database {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading db file:', err);
  }
  return { users: {} };
}

function writeDb(db: Database) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db file:', err);
  }
}

// Server-side Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==================== AUTH & USER SYNC ====================

// Login or auto-register simple profile
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { name, username, password } = req.body;
  if (!username || !username.trim()) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const cleanUsername = username.trim().toLowerCase();
  const db = readDb();

  let user = db.users[cleanUsername];
  if (!user) {
    // New user auto-registration
    user = {
      username: cleanUsername,
      displayName: (name && name.trim()) || username.trim(),
      password: password || '',
      history: [],
      notes: [],
      mnemonics: [],
      stats: {
        totalAnswered: 0,
        totalCorrect: 0,
        subjectStats: {},
      },
      lastActive: Date.now(),
    };
    db.users[cleanUsername] = user;
    writeDb(db);
  } else {
    // Existing user
    if (name && name.trim()) {
      user.displayName = name.trim();
    }
    user.lastActive = Date.now();
    writeDb(db);
  }

  res.json({
    success: true,
    user: {
      username: user.username,
      displayName: user.displayName,
      history: user.history || [],
      notes: user.notes || [],
      mnemonics: user.mnemonics || [],
      stats: user.stats || { totalAnswered: 0, totalCorrect: 0, subjectStats: {} },
      lastActive: user.lastActive,
    },
  });
});

// Sync data from any device
app.post('/api/user/sync', (req: Request, res: Response) => {
  const { username, history, notes, mnemonics, stats } = req.body;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const cleanUsername = username.trim().toLowerCase();
  const db = readDb();
  let user = db.users[cleanUsername];

  if (!user) {
    user = {
      username: cleanUsername,
      displayName: cleanUsername,
      history: history || [],
      notes: notes || [],
      mnemonics: mnemonics || [],
      stats: stats || { totalAnswered: 0, totalCorrect: 0, subjectStats: {} },
      lastActive: Date.now(),
    };
  } else {
    if (history) user.history = history;
    if (notes) user.notes = notes;
    if (mnemonics) user.mnemonics = mnemonics;
    if (stats) user.stats = stats;
    user.lastActive = Date.now();
  }

  db.users[cleanUsername] = user;
  writeDb(db);

  res.json({ success: true, timestamp: user.lastActive });
});

// Fetch user data
app.get('/api/user/data', (req: Request, res: Response) => {
  const username = req.query.username as string;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const cleanUsername = username.trim().toLowerCase();
  const db = readDb();
  const user = db.users[cleanUsername];

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    user: {
      username: user.username,
      displayName: user.displayName,
      history: user.history || [],
      notes: user.notes || [],
      mnemonics: user.mnemonics || [],
      stats: user.stats || { totalAnswered: 0, totalCorrect: 0, subjectStats: {} },
      lastActive: user.lastActive,
    },
  });
});

// ==================== AI CAPABILITIES ====================

// Generate dynamic OpenStax textbook questions on demand for true unlimited practice
app.post('/api/ai/generate-questions', async (req: Request, res: Response) => {
  const { subjectName, chapter, textbook, count = 3 } = req.body;

  if (!ai) {
    res.status(503).json({ error: 'AI engine not configured' });
    return;
  }

  try {
    const prompt = `You are an expert college professor authoring rigorous collegiate CLEP examination questions grounded strictly in the official OpenStax textbook: "${textbook}".
Generate ${count} authentic multiple-choice questions for the following subject and chapter:
Subject: ${subjectName}
Chapter: ${chapter}

Each question must strictly have:
- Exactly 4 options (a, b, c, d)
- One unambiguously correct option verified by textbook facts
- 3 plausible academic distractors with explanations for why each is wrong
- In-depth collegiate mini-lesson explanation ("whyCorrect", "coreConcept", "textbookExcerpt")
- A memorable mnemonic aid (phrase and breakdown)

Return strictly valid JSON matching this schema:
[
  {
    "id": "gen-${Date.now()}-1",
    "question": "question text",
    "options": [
      { "id": "a", "text": "..." },
      { "id": "b", "text": "..." },
      { "id": "c", "text": "..." },
      { "id": "d", "text": "..." }
    ],
    "correctOptionId": "a",
    "explanation": {
      "coreConcept": "summary of core theorem or concept",
      "textbookExcerpt": "${textbook}: description of chapter concept",
      "whyCorrect": "step-by-step why the right answer is true",
      "distractorBreakdown": {
        "b": "why b is flawed",
        "c": "why c is flawed",
        "d": "why d is flawed"
      },
      "keyTakeaway": "core summary rule"
    },
    "defaultMnemonic": {
      "phrase": "SHORT MEMORABLE PHRASE",
      "acronymBreakdown": ["letter 1 meaning", "letter 2 meaning"],
      "explanation": "quick hook"
    }
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ questions: parsed });
  } catch (err: any) {
    console.error('Error generating AI questions:', err);
    res.status(500).json({ error: 'Failed to generate questions', details: err.message });
  }
});

// Dynamic Mnemonic Generator
app.post('/api/ai/mnemonic', async (req: Request, res: Response) => {
  const { concept, subjectName, chapter } = req.body;

  if (!ai) {
    res.json({
      mnemonic: {
        phrase: 'CORE FACT KEY',
        acronymBreakdown: ['C - Concept', 'F - Fact', 'K - Knowledge'],
        explanation: 'Review the textbook definitions for this chapter.',
      },
    });
    return;
  }

  try {
    const prompt = `Create an ingenious, highly memorable collegiate mnemonic (acronym, witty phrase, or rhyming association) to help a student memorize this academic concept for their CLEP university exam:
Subject: ${subjectName}
Chapter: ${chapter}
Concept: ${concept}

Respond with pure JSON:
{
  "phrase": "THE MEMORABLE PHRASE OR ACRONYM",
  "breakdown": [
    "Letter/Word 1: meaning",
    "Letter/Word 2: meaning"
  ],
  "explanation": "Brief 1-sentence tip on how to trigger this memory during the exam."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ mnemonic: parsed });
  } catch (err: any) {
    console.error('Error generating mnemonic:', err);
    res.status(500).json({ error: 'Failed to generate mnemonic' });
  }
});

// Dynamic Deep Explanation / Mini-lesson
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  const { question, selectedOptionText, correctOptionText, textbookRef } = req.body;

  if (!ai) {
    res.json({
      deepExplanation: 'Grounded in textbook principles. Review chapter readings for comprehensive breakdown.',
    });
    return;
  }

  try {
    const prompt = `Provide an authoritative university-level mini-lesson explaining this CLEP multiple-choice question:
Reference: ${textbookRef}
Question: ${question}
Correct Answer: ${correctOptionText}
${selectedOptionText ? `Student Selected: ${selectedOptionText}` : ''}

Include:
1. Historical / scientific foundation and OpenStax core context
2. Step-by-step logical proof of why the correct option is irrefutably true
3. Clarification of the common pitfall or trap in the question
4. High-yield memory summary`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ deepExplanation: response.text });
  } catch (err: any) {
    console.error('Error generating deep explanation:', err);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// ==================== VITE MIDDLEWARE & SERVER START ====================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CLEP Scholar server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
