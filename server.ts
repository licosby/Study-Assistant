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
const rawApiKey = process.env.GEMINI_API_KEY || '';
const isValidKey = rawApiKey && rawApiKey !== 'MY_GEMINI_API_KEY' && !rawApiKey.includes('MY_');
const ai = isValidKey
  ? new GoogleGenAI({
      apiKey: rawApiKey,
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

function generateSmartMnemonic(concept: string, subjectName: string, chapter: string, style: string) {
  const clean = (concept || 'Core Concept')
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w: string) => w.length > 2);

  const keywords = clean.length > 0 ? clean.slice(0, 5) : ['Core', 'Fact', 'Knowledge'];
  const acronym = keywords.map((k: string) => k[0].toUpperCase()).join('') || 'KEY';

  if (style === 'acrostic') {
    const acrosticWords = ['Please', 'Make', 'All', 'Tests', 'Count', 'Carefully'];
    return {
      phrase: keywords.map((k: string, i: number) => acrosticWords[i] || k).join(' '),
      style: 'acrostic',
      breakdown: keywords.map((k: string, i: number) => `${acrosticWords[i] || k[0].toUpperCase()} → ${k}`),
      explanation: 'Each word in the sentence triggers the corresponding concept term in sequential order.',
      retrievalCue: 'Run through the sentence in your mind to retrieve the list of facts.',
      recallQuestion: 'What sequence of concepts does this acrostic phrase represent?',
      recallAnswer: keywords.join(' → '),
    };
  } else if (style === 'rhyme') {
    return {
      phrase: `Remember ${keywords[0] || 'the rule'} to keep it clear, when testing day is drawing near!`,
      style: 'rhyme',
      breakdown: keywords.map((k: string) => `Key concept: ${k}`),
      explanation: 'Rhyme and auditory cadence lock the definition in acoustic memory for fast recall.',
      retrievalCue: 'Recite the rhyme mentally when you encounter this question topic.',
      recallQuestion: 'Which key principle does this rhyme remind you of?',
      recallAnswer: concept,
    };
  } else if (style === 'visual_hook') {
    return {
      phrase: `Picture ${keywords[0] || 'the concept'} interacting directly with ${keywords[1] || 'the principle'} under a bright spotlight!`,
      style: 'visual_hook',
      breakdown: keywords.map((k: string) => `Visual anchor: ${k}`),
      explanation: 'Vivid spatial visualization activates episodic memory pathways in the brain.',
      retrievalCue: 'Visualize the mental scene when you see this question keyword.',
      recallQuestion: 'What is the primary visual anchor in this scene?',
      recallAnswer: keywords[0] || 'Core subject',
    };
  } else {
    return {
      phrase: `${acronym} ("${keywords.map((k: string) => k.toUpperCase()).join(' - ')}")`,
      style: 'acronym',
      breakdown: keywords.map((k: string) => `${k[0].toUpperCase()} stands for: ${k}`),
      explanation: `Anchor each critical keyword in sequential order: ${keywords.join(' → ')}.`,
      retrievalCue: `Recall "${acronym}" when this question appears on the exam.`,
      recallQuestion: `What does the first letter "${keywords[0]?.[0]?.toUpperCase() || 'K'}" stand for?`,
      recallAnswer: keywords[0] || 'Key Term',
    };
  }
}

// Dynamic Collegiate Mnemonic Generator
app.post('/api/ai/mnemonic', async (req: Request, res: Response) => {
  const { concept, subjectName, chapter, style = 'acronym' } = req.body;

  if (!ai) {
    res.json({
      mnemonic: generateSmartMnemonic(concept, subjectName, chapter, style),
    });
    return;
  }

  try {
    const styleInstructions: Record<string, string> = {
      acronym: 'Create a punchy ACRONYM where each letter stands for a key step, component, or fact (like HOMES, OIL RIG, or PEMDAS).',
      acrostic: 'Create an ACROSTIC SENTENCE where the first letter of each word corresponds to the facts in sequential order (like "King Philip Came Over For Good Soup").',
      rhyme: 'Create a catchy 2-line RHYMING COUPLET or jingle that locks the rule or equation in auditory memory.',
      visual_hook: 'Create a bizarre, vivid VISUAL MENTAL SCENE connecting the concepts in an unforgettable image.'
    };

    const instruction = styleInstructions[style] || styleInstructions.acronym;

    const prompt = `You are a memory coach and university professor creating a memorable collegiate mnemonic for students studying difficult academic concepts for CLEP college test-outs.
Subject: ${subjectName || 'College Core'}
Chapter: ${chapter || 'General'}
Concept/Fact to memorize: "${concept}"

Format requirement:
${instruction}

Respond with strictly valid JSON:
{
  "phrase": "THE MEMORABLE MNEMONIC PHRASE OR ACRONYM",
  "style": "${style}",
  "breakdown": [
    "Item 1: detailed meaning and link to concept",
    "Item 2: detailed meaning and link to concept"
  ],
  "explanation": "Why this specific memory hook works and how to mentally trigger it under exam pressure.",
  "retrievalCue": "Quick 1-sentence mental trigger to retrieve this during a timed exam.",
  "recallQuestion": "A quick self-test question to test whether the student remembered the mnemonic.",
  "recallAnswer": "The answer to the self-test question."
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
    console.warn('AI generation unavailable, using smart collegiate fallback:', err?.message);
    res.json({
      mnemonic: generateSmartMnemonic(concept, subjectName, chapter, style),
    });
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
