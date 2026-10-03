import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  BarChart3, 
  Filter, 
  Sparkles, 
  RotateCcw, 
  ArrowUpRight, 
  ArrowDownRight, 
  BookOpen, 
  Timer, 
  AlertTriangle,
  Layers,
  ChevronRight,
  Zap
} from 'lucide-react';
import { HistoryItem, Question } from '../types';
import { ALL_SUBJECTS } from '../data/subjects';

interface PerformanceDashboardProps {
  history: HistoryItem[];
  allQuestions: Question[];
  onStartSubjectDrill?: (subjectId: string) => void;
  onOpenMockExam?: () => void;
}

// Pre-seeded sample historical sessions to demonstrate trends when user has minimal data
const SAMPLE_HISTORY: HistoryItem[] = [
  // 5 days ago - Initial Diagnostic Exam (62%)
  { id: 's-1', questionId: 'q-1', subjectId: 'us-history-1', chapter: 'Ch 6: Independence', questionText: 'Continental Congress', selectedOptionId: 'B', selectedOptionText: 'Philadelphia', correctOptionId: 'B', correctOptionText: 'Philadelphia', isCorrect: true, timestamp: Date.now() - 5 * 86400000 + 10000, mode: 'exam', textbookRef: 'OpenStax US History' },
  { id: 's-2', questionId: 'q-2', subjectId: 'us-history-1', chapter: 'Ch 7: Constitution', questionText: 'Articles of Confederation', selectedOptionId: 'A', selectedOptionText: 'Weak central power', correctOptionId: 'A', correctOptionText: 'Weak central power', isCorrect: true, timestamp: Date.now() - 5 * 86400000 + 20000, mode: 'exam', textbookRef: 'OpenStax US History' },
  { id: 's-3', questionId: 'q-3', subjectId: 'biology', chapter: 'Ch 4: Cell Structure', questionText: 'Mitochondria function', selectedOptionId: 'C', selectedOptionText: 'Ribosome synthesis', correctOptionId: 'A', correctOptionText: 'ATP synthesis', isCorrect: false, timestamp: Date.now() - 5 * 86400000 + 30000, mode: 'exam', textbookRef: 'OpenStax Biology' },
  { id: 's-4', questionId: 'q-4', subjectId: 'biology', chapter: 'Ch 8: Photosynthesis', questionText: 'Calvin cycle location', selectedOptionId: 'B', selectedOptionText: 'Thylakoid lumen', correctOptionId: 'C', correctOptionText: 'Stroma', isCorrect: false, timestamp: Date.now() - 5 * 86400000 + 40000, mode: 'exam', textbookRef: 'OpenStax Biology' },
  { id: 's-5', questionId: 'q-5', subjectId: 'college-algebra', chapter: 'Ch 2: Quadratic Equations', questionText: 'Discriminant value', selectedOptionId: 'A', selectedOptionText: 'b^2 - 4ac', correctOptionId: 'A', correctOptionText: 'b^2 - 4ac', isCorrect: true, timestamp: Date.now() - 5 * 86400000 + 50000, mode: 'exam', textbookRef: 'OpenStax Algebra' },
  
  // 4 days ago - Drill Session (68%)
  { id: 's-6', questionId: 'q-6', subjectId: 'chemistry', chapter: 'Ch 4: Stoichiometry', questionText: 'Mole ratio balance', selectedOptionId: 'B', selectedOptionText: '1:2', correctOptionId: 'B', correctOptionText: '1:2', isCorrect: true, timestamp: Date.now() - 4 * 86400000 + 10000, mode: 'drill', textbookRef: 'OpenStax Chemistry' },
  { id: 's-7', questionId: 'q-7', subjectId: 'chemistry', chapter: 'Ch 14: Acid-Base', questionText: 'pH calculation', selectedOptionId: 'C', selectedOptionText: 'pH = 5', correctOptionId: 'C', correctOptionText: 'pH = 5', isCorrect: true, timestamp: Date.now() - 4 * 86400000 + 20000, mode: 'drill', textbookRef: 'OpenStax Chemistry' },
  { id: 's-8', questionId: 'q-8', subjectId: 'spanish', chapter: 'Ch 2: Gramática Ser/Estar', questionText: 'Condition vs Identity', selectedOptionId: 'B', selectedOptionText: 'Estar for condition', correctOptionId: 'B', correctOptionText: 'Estar for condition', isCorrect: true, timestamp: Date.now() - 4 * 86400000 + 30000, mode: 'drill', textbookRef: 'OpenStax Spanish' },
  { id: 's-9', questionId: 'q-9', subjectId: 'spanish', chapter: 'Ch 4: Listening', questionText: 'Train arrival time', selectedOptionId: 'A', selectedOptionText: '3:30', correctOptionId: 'B', correctOptionText: '4:30', isCorrect: false, timestamp: Date.now() - 4 * 86400000 + 40000, mode: 'drill', textbookRef: 'OpenStax Spanish' },

  // 3 days ago - Midterm Mock Exam 1 (74%)
  { id: 's-10', questionId: 'q-10', subjectId: 'macroeconomics', chapter: 'Ch 6: GDP Calculation', questionText: 'C+I+G+NX expenditure', selectedOptionId: 'A', selectedOptionText: 'Total domestic spending', correctOptionId: 'A', correctOptionText: 'Total domestic spending', isCorrect: true, timestamp: Date.now() - 3 * 86400000 + 10000, mode: 'exam', textbookRef: 'OpenStax Macroeconomics' },
  { id: 's-11', questionId: 'q-11', subjectId: 'microeconomics', chapter: 'Ch 3: Supply & Demand', questionText: 'Price ceiling shortage', selectedOptionId: 'B', selectedOptionText: 'Excess demand', correctOptionId: 'B', correctOptionText: 'Excess demand', isCorrect: true, timestamp: Date.now() - 3 * 86400000 + 20000, mode: 'exam', textbookRef: 'OpenStax Microeconomics' },
  { id: 's-12', questionId: 'q-12', subjectId: 'biology', chapter: 'Ch 4: Cell Structure', questionText: 'Rough ER ribosomes', selectedOptionId: 'A', selectedOptionText: 'Secretory proteins', correctOptionId: 'A', correctOptionText: 'Secretory proteins', isCorrect: true, timestamp: Date.now() - 3 * 86400000 + 30000, mode: 'exam', textbookRef: 'OpenStax Biology' },
  { id: 's-13', questionId: 'q-13', subjectId: 'statistics', chapter: 'Ch 6: Normal Distribution', questionText: 'Empirical 68-95-99.7', selectedOptionId: 'C', selectedOptionText: '95% within 2 SD', correctOptionId: 'C', correctOptionText: '95% within 2 SD', isCorrect: true, timestamp: Date.now() - 3 * 86400000 + 40000, mode: 'exam', textbookRef: 'OpenStax Statistics' },
  { id: 's-14', questionId: 'q-14', subjectId: 'statistics', chapter: 'Ch 9: Hypothesis Testing', questionText: 'Type I error alpha', selectedOptionId: 'B', selectedOptionText: 'False negative', correctOptionId: 'A', correctOptionText: 'False positive rejection', isCorrect: false, timestamp: Date.now() - 3 * 86400000 + 50000, mode: 'exam', textbookRef: 'OpenStax Statistics' },

  // 2 days ago - Targeted Weak Spot Drills (81%)
  { id: 's-15', questionId: 'q-15', subjectId: 'biology', chapter: 'Ch 8: Photosynthesis', questionText: 'Thylakoid proton gradient', selectedOptionId: 'A', selectedOptionText: 'Chemiosmotic ATP synthesis', correctOptionId: 'A', correctOptionText: 'Chemiosmotic ATP synthesis', isCorrect: true, timestamp: Date.now() - 2 * 86400000 + 10000, mode: 'drill', textbookRef: 'OpenStax Biology' },
  { id: 's-16', questionId: 'q-16', subjectId: 'biology', chapter: 'Ch 14: DNA Replication', questionText: 'DNA Polymerase III 5 to 3', selectedOptionId: 'A', selectedOptionText: '5 prime to 3 prime synthesis', correctOptionId: 'A', correctOptionText: '5 prime to 3 prime synthesis', isCorrect: true, timestamp: Date.now() - 2 * 86400000 + 20000, mode: 'drill', textbookRef: 'OpenStax Biology' },
  { id: 's-17', questionId: 'q-17', subjectId: 'accounting', chapter: 'Ch 2: Debits & Credits', questionText: 'DEALER normal balances', selectedOptionId: 'B', selectedOptionText: 'Expenses debited to increase', correctOptionId: 'B', correctOptionText: 'Expenses debited to increase', isCorrect: true, timestamp: Date.now() - 2 * 86400000 + 30000, mode: 'drill', textbookRef: 'OpenStax Accounting' },
  { id: 's-18', questionId: 'q-18', subjectId: 'calculus', chapter: 'Ch 3: Chain Rule', questionText: 'Composite function derivative', selectedOptionId: 'A', selectedOptionText: 'f prime of g(x) times g prime(x)', correctOptionId: 'A', correctOptionText: 'f prime of g(x) times g prime(x)', isCorrect: true, timestamp: Date.now() - 2 * 86400000 + 40000, mode: 'drill', textbookRef: 'OpenStax Calculus' },

  // 1 day ago - Comprehensive CLEP Full Mock Exam (85%)
  { id: 's-19', questionId: 'q-19', subjectId: 'us-history-1', chapter: 'Ch 14: Civil War', questionText: 'Emancipation Proclamation', selectedOptionId: 'B', selectedOptionText: 'Freed slaves in rebellious states', correctOptionId: 'B', correctOptionText: 'Freed slaves in rebellious states', isCorrect: true, timestamp: Date.now() - 86400000 + 10000, mode: 'exam', textbookRef: 'OpenStax US History' },
  { id: 's-20', questionId: 'q-20', subjectId: 'chemistry', chapter: 'Ch 13: Equilibria', questionText: 'Le Chatelier pressure increase', selectedOptionId: 'A', selectedOptionText: 'Shifts toward fewer moles of gas', correctOptionId: 'A', correctOptionText: 'Shifts toward fewer moles of gas', isCorrect: true, timestamp: Date.now() - 86400000 + 20000, mode: 'exam', textbookRef: 'OpenStax Chemistry' },
  { id: 's-21', questionId: 'q-21', subjectId: 'college-algebra', chapter: 'Ch 6: Exponential Functions', questionText: 'Logarithm change of base', selectedOptionId: 'C', selectedOptionText: 'ln(x) / ln(b)', correctOptionId: 'C', correctOptionText: 'ln(x) / ln(b)', isCorrect: true, timestamp: Date.now() - 86400000 + 30000, mode: 'exam', textbookRef: 'OpenStax Algebra' },
  { id: 's-22', questionId: 'q-22', subjectId: 'french', chapter: 'Ch 2: Passé Composé vs Imparfait', questionText: 'Completed action in past', selectedOptionId: 'A', selectedOptionText: 'Passé composé for completed events', correctOptionId: 'A', correctOptionText: 'Passé composé for completed events', isCorrect: true, timestamp: Date.now() - 86400000 + 40000, mode: 'exam', textbookRef: 'Modern States French' },
  { id: 's-23', questionId: 'q-23', subjectId: 'statistics', chapter: 'Ch 7: Central Limit Theorem', questionText: 'Standard error of the mean', selectedOptionId: 'B', selectedOptionText: 'sigma / sqrt(n)', correctOptionId: 'B', correctOptionText: 'sigma / sqrt(n)', isCorrect: true, timestamp: Date.now() - 86400000 + 50000, mode: 'exam', textbookRef: 'OpenStax Statistics' },

  // Today - Polish & Mastery Exam (88%)
  { id: 's-24', questionId: 'q-24', subjectId: 'biology', chapter: 'Ch 7: Cellular Respiration', questionText: 'ATP synthase chemiosmosis', selectedOptionId: 'A', selectedOptionText: 'Proton gradient drives rotational motor', correctOptionId: 'A', correctOptionText: 'Proton gradient drives rotational motor', isCorrect: true, timestamp: Date.now() - 3600000, mode: 'exam', textbookRef: 'OpenStax Biology' },
  { id: 's-25', questionId: 'q-25', subjectId: 'precalculus', chapter: 'Ch 7: Trig Identities', questionText: 'sin^2(x) + cos^2(x)', selectedOptionId: 'B', selectedOptionText: '1', correctOptionId: 'B', correctOptionText: '1', isCorrect: true, timestamp: Date.now() - 1800000, mode: 'exam', textbookRef: 'OpenStax Precalc' },
];

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  history,
  allQuestions,
  onStartSubjectDrill,
  onOpenMockExam,
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'all' | '30d' | '7d'>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'exam' | 'drill'>('all');
  const [previewSample, setPreviewSample] = useState(history.length < 5);

  // Choose dataset (user history or sample data when requested or empty)
  const activeDataset = useMemo(() => {
    if (previewSample || history.length === 0) {
      // If user has some items, merge or use sample
      return history.length >= 3 && !previewSample ? history : SAMPLE_HISTORY;
    }
    return history;
  }, [history, previewSample]);

  // Filter dataset by timeframe and mode
  const filteredHistory = useMemo(() => {
    let items = [...activeDataset].sort((a, b) => a.timestamp - b.timestamp);

    // Filter by mode
    if (selectedMode !== 'all') {
      items = items.filter((item) => item.mode === selectedMode);
    }

    // Filter by timeframe
    const now = Date.now();
    if (selectedTimeframe === '7d') {
      items = items.filter((item) => now - item.timestamp <= 7 * 86400000);
    } else if (selectedTimeframe === '30d') {
      items = items.filter((item) => now - item.timestamp <= 30 * 86400000);
    }

    return items;
  }, [activeDataset, selectedMode, selectedTimeframe]);

  // Top level KPIs
  const kpis = useMemo(() => {
    const total = filteredHistory.length;
    const correct = filteredHistory.filter((i) => i.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    
    // Exam specific stats
    const examItems = filteredHistory.filter((i) => i.mode === 'exam');
    const examTotal = examItems.length;
    const examCorrect = examItems.filter((i) => i.isCorrect).length;
    const examAccuracy = examTotal > 0 ? Math.round((examCorrect / examTotal) * 100) : 0;

    // Recent Momentum: last 10 vs previous 10
    const sorted = [...filteredHistory].sort((a, b) => b.timestamp - a.timestamp);
    const recent10 = sorted.slice(0, 10);
    const prev10 = sorted.slice(10, 20);

    const recentAcc = recent10.length > 0 
      ? Math.round((recent10.filter((i) => i.isCorrect).length / recent10.length) * 100) 
      : 0;
    const prevAcc = prev10.length > 0 
      ? Math.round((prev10.filter((i) => i.isCorrect).length / prev10.length) * 100) 
      : recentAcc;

    const momentumDelta = recentAcc - prevAcc;
    const isPassing = accuracy >= 80;
    const isExamPassing = examAccuracy >= 80;

    return {
      total,
      correct,
      incorrect: total - correct,
      accuracy,
      examTotal,
      examCorrect,
      examAccuracy,
      isPassing,
      isExamPassing,
      recentAcc,
      momentumDelta,
    };
  }, [filteredHistory]);

  // Generate Chronological Trend Data points for Recharts Line/Area chart
  const timelineData = useMemo(() => {
    if (filteredHistory.length === 0) return [];

    let runningCorrect = 0;
    const points: {
      index: number;
      label: string;
      cumulativeAccuracy: number;
      rollingAccuracy: number;
      mode: string;
      subject: string;
      isCorrect: boolean;
      passingBenchmark: number;
    }[] = [];

    // Rolling window of size 5
    const windowSize = 5;
    const recentWindow: boolean[] = [];

    filteredHistory.forEach((item, idx) => {
      if (item.isCorrect) runningCorrect++;
      recentWindow.push(item.isCorrect);
      if (recentWindow.length > windowSize) recentWindow.shift();

      const rollingCorrect = recentWindow.filter(Boolean).length;
      const rollingAcc = Math.round((rollingCorrect / recentWindow.length) * 100);
      const cumAcc = Math.round((runningCorrect / (idx + 1)) * 100);

      const dateStr = new Date(item.timestamp).toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
      });

      const subj = ALL_SUBJECTS.find((s) => s.id === item.subjectId)?.name || item.subjectId;

      points.push({
        index: idx + 1,
        label: `Q${idx + 1} (${dateStr})`,
        cumulativeAccuracy: cumAcc,
        rollingAccuracy: rollingAcc,
        mode: item.mode === 'exam' ? 'Exam' : 'Drill',
        subject: subj,
        isCorrect: item.isCorrect,
        passingBenchmark: 80,
      });
    });

    return points;
  }, [filteredHistory]);

  // Subject Breakdown data for BarChart
  const subjectBreakdownData = useMemo(() => {
    const stats: Record<string, { total: number; correct: number; name: string }> = {};

    filteredHistory.forEach((item) => {
      if (!stats[item.subjectId]) {
        const subj = ALL_SUBJECTS.find((s) => s.id === item.subjectId);
        stats[item.subjectId] = {
          total: 0,
          correct: 0,
          name: subj ? subj.name.split(' (')[0] : item.subjectId,
        };
      }
      stats[item.subjectId].total++;
      if (item.isCorrect) stats[item.subjectId].correct++;
    });

    return Object.entries(stats).map(([subjectId, data]) => {
      const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
      return {
        subjectId,
        name: data.name,
        accuracy,
        total: data.total,
        correct: data.correct,
        isPassing: accuracy >= 80,
        benchmark: 80,
      };
    }).sort((a, b) => b.total - a.total);
  }, [filteredHistory]);

  // Academic Category Radar Data
  const categoryRadarData = useMemo(() => {
    const catMap: Record<string, { total: number; correct: number }> = {};

    filteredHistory.forEach((item) => {
      const subj = ALL_SUBJECTS.find((s) => s.id === item.subjectId);
      const category = subj?.category || 'General';
      if (!catMap[category]) catMap[category] = { total: 0, correct: 0 };
      catMap[category].total++;
      if (item.isCorrect) catMap[category].correct++;
    });

    return Object.entries(catMap).map(([category, data]) => ({
      category: category.replace(' & ', '/').replace('Computer Science', 'CS'),
      score: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      benchmark: 80,
      totalQuestions: data.total,
    }));
  }, [filteredHistory]);

  // Weak Spots & Focus Areas (Chapters or subjects below 80%)
  const weakSpotAreas = useMemo(() => {
    const areaStats: Record<string, { subjectId: string; subjectName: string; chapter: string; total: number; correct: number }> = {};

    filteredHistory.forEach((item) => {
      const key = `${item.subjectId}-${item.chapter}`;
      if (!areaStats[key]) {
        const subj = ALL_SUBJECTS.find((s) => s.id === item.subjectId);
        areaStats[key] = {
          subjectId: item.subjectId,
          subjectName: subj?.name || item.subjectId,
          chapter: item.chapter,
          total: 0,
          correct: 0,
        };
      }
      areaStats[key].total++;
      if (item.isCorrect) areaStats[key].correct++;
    });

    return Object.values(areaStats)
      .filter((a) => a.total >= 1 && (a.correct / a.total) < 0.8)
      .map((a) => ({
        ...a,
        accuracy: Math.round((a.correct / a.total) * 100),
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 6);
  }, [filteredHistory]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-fade-in text-[#1B1B19] font-['Inter']">
      {/* Top Academic Header */}
      <div className="bg-white border-2 border-[#1B1B19] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[rgba(27,27,25,0.12)]">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-[#E15B44]" />
                <span>CLEP Institutional Analytics</span>
              </span>
              <span className="text-[#1B1B19]/30 font-['Space_Mono'] text-xs">/</span>
              <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">
                80% Passing Benchmark Metric Engine
              </span>
            </div>

            <h2 className="font-['Space_Mono'] text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1B19] uppercase m-0 leading-tight">
              Performance Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#1B1B19]/70 mt-1 max-w-2xl leading-relaxed">
              Real-time score trajectories, moving averages, and subject readiness models pulled from your active study session history.
            </p>
          </div>

          {/* Quick Action / Data Mode Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => setPreviewSample(!previewSample)}
                className={`font-['Space_Mono'] text-xs uppercase tracking-wider px-3.5 py-2 border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  previewSample
                    ? 'bg-[#EFECE6] border-[#1B1B19] text-[#1B1B19] font-bold'
                    : 'bg-white border-[rgba(27,27,25,0.2)] text-[#1B1B19]/80 hover:border-[#1B1B19]'
                }`}
                title="Toggle between your live test data and sample trajectory"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E15B44]" />
                <span>{previewSample ? 'Showing Sample Trajectory' : 'Using Live History'}</span>
              </button>
            )}

            {onOpenMockExam && (
              <button
                type="button"
                onClick={onOpenMockExam}
                className="font-['Space_Mono'] text-xs uppercase tracking-wider font-bold px-4 py-2 bg-[#1B1B19] hover:bg-[#E15B44] text-white border border-[#1B1B19] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Timer className="w-3.5 h-3.5" />
                <span>Launch Mock Exam</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs font-['Space_Mono']">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase text-[#1B1B19]/50 tracking-wider mr-1">Mode:</span>
            <button
              type="button"
              onClick={() => setSelectedMode('all')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${
                selectedMode === 'all'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              All Sessions
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('exam')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${
                selectedMode === 'exam'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              Timed Exams Only
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode('drill')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${
                selectedMode === 'drill'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              Study Drills Only
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase text-[#1B1B19]/50 tracking-wider mr-1">Period:</span>
            <button
              type="button"
              onClick={() => setSelectedTimeframe('all')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${
                selectedTimeframe === 'all'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              All Time
            </button>
            <button
              type="button"
              onClick={() => setSelectedTimeframe('30d')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${
                selectedTimeframe === '30d'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => setSelectedTimeframe('7d')}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-wider border cursor-pointer transition-all ${
                selectedTimeframe === '7d'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              Last 7 Days
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Overall Cumulative Accuracy */}
        <div className={`p-5 bg-white border-2 transition-all shadow-sm ${
          kpis.isPassing ? 'border-emerald-700 bg-emerald-50/20' : 'border-[#1B1B19]'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(27,27,25,0.1)]">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-semibold">
              Cumulative Score
            </span>
            {kpis.isPassing ? (
              <span className="font-['Space_Mono'] text-[9px] uppercase font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-400">
                Passing (≥80%)
              </span>
            ) : (
              <span className="font-['Space_Mono'] text-[9px] uppercase font-bold px-1.5 py-0.5 bg-rose-100 text-[#E15B44] border border-rose-300">
                Target: 80%
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div className="font-['Space_Mono'] text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1B19]">
              {kpis.accuracy}%
            </div>
            <div className="text-right text-xs text-[#1B1B19]/60 font-['Space_Mono']">
              <strong>{kpis.correct}</strong> / {kpis.total} Correct
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[rgba(27,27,25,0.08)] flex items-center justify-between text-[11px] text-[#1B1B19]/70">
            <span>Passing Gap:</span>
            <span className={`font-bold font-['Space_Mono'] ${kpis.accuracy >= 80 ? 'text-emerald-700' : 'text-[#E15B44]'}`}>
              {kpis.accuracy >= 80 ? `+${kpis.accuracy - 80}% Above Standard` : `${kpis.accuracy - 80}% to Benchmark`}
            </span>
          </div>
        </div>

        {/* Metric 2: Timed Mock Exam Accuracy */}
        <div className={`p-5 bg-white border-2 transition-all shadow-sm ${
          kpis.isExamPassing ? 'border-emerald-700 bg-emerald-50/20' : 'border-[#1B1B19]'
        }`}>
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(27,27,25,0.1)]">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-semibold">
              Exam Simulation
            </span>
            <Timer className="w-3.5 h-3.5 text-[#E15B44]" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div className="font-['Space_Mono'] text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1B19]">
              {kpis.examTotal > 0 ? `${kpis.examAccuracy}%` : 'N/A'}
            </div>
            <div className="text-right text-xs text-[#1B1B19]/60 font-['Space_Mono']">
              {kpis.examTotal > 0 ? `${kpis.examCorrect}/${kpis.examTotal} Tested` : '0 Exam Questions'}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[rgba(27,27,25,0.08)] flex items-center justify-between text-[11px] text-[#1B1B19]/70">
            <span>CLEP Readiness:</span>
            <span className="font-bold font-['Space_Mono'] text-[#1B1B19]">
              {kpis.examTotal === 0 ? 'Take 1st Exam' : kpis.examAccuracy >= 80 ? 'Ready for Credit' : 'Needs Reinforcement'}
            </span>
          </div>
        </div>

        {/* Metric 3: Recent Velocity & Momentum */}
        <div className="p-5 bg-white border-2 border-[#1B1B19] shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(27,27,25,0.1)]">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-semibold">
              Recent Trajectory
            </span>
            <span className="font-['Space_Mono'] text-[9px] uppercase px-1.5 py-0.5 bg-[#F8F7F4] border border-[rgba(27,27,25,0.15)]">
              Last 10 Qs
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div className="font-['Space_Mono'] text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1B19]">
              {kpis.recentAcc}%
            </div>
            <div className={`flex items-center gap-1 font-['Space_Mono'] text-xs font-bold ${
              kpis.momentumDelta >= 0 ? 'text-emerald-700' : 'text-[#E15B44]'
            }`}>
              {kpis.momentumDelta >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{kpis.momentumDelta >= 0 ? `+${kpis.momentumDelta}%` : `${kpis.momentumDelta}%`}</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[rgba(27,27,25,0.08)] flex items-center justify-between text-[11px] text-[#1B1B19]/70">
            <span>Velocity Trend:</span>
            <span className="font-bold font-['Space_Mono'] text-[#1B1B19]">
              {kpis.momentumDelta > 5 ? 'Accelerating Fast' : kpis.momentumDelta >= 0 ? 'Steady Progress' : 'Review Required'}
            </span>
          </div>
        </div>

        {/* Metric 4: Total Questions Mastered */}
        <div className="p-5 bg-white border-2 border-[#1B1B19] shadow-sm">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[rgba(27,27,25,0.1)]">
            <span className="font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-semibold">
              Study Volume
            </span>
            <Layers className="w-3.5 h-3.5 text-[#1B1B19]/50" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <div className="font-['Space_Mono'] text-3xl sm:text-4xl font-bold tracking-tight text-[#1B1B19]">
              {kpis.total}
            </div>
            <div className="text-right text-xs text-[#1B1B19]/60 font-['Space_Mono']">
              Questions Total
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[rgba(27,27,25,0.08)] flex items-center justify-between text-[11px] text-[#1B1B19]/70">
            <span>Accuracy Rate:</span>
            <span className="font-bold font-['Space_Mono'] text-emerald-700">
              {kpis.correct} Correct ({kpis.accuracy}%)
            </span>
          </div>
        </div>
      </div>

      {/* PRIMARY CHART 1: Chronological Score Trajectory Over Time */}
      <div className="bg-white border-2 border-[#1B1B19] p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-6 border-b border-[rgba(27,27,25,0.12)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
                Time Series Progression
              </span>
              <span className="text-[#1B1B19]/30 font-['Space_Mono'] text-xs">/</span>
              <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">Sequential Questions</span>
            </div>
            <h3 className="font-['Space_Mono'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#1B1B19]">
              Score Trajectory & 80% Benchmark Standard
            </h3>
          </div>

          <div className="flex items-center gap-3 font-['Space_Mono'] text-[11px] text-[#1B1B19]/70">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-[#E15B44]" />
              <span>Cumulative Accuracy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#1B1B19]" />
              <span>5-Q Rolling Average</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 border-t border-dashed border-[#E15B44]" />
              <span>80% Passing</span>
            </div>
          </div>
        </div>

        {/* Recharts Area/Line Chart */}
        <div className="h-72 sm:h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E15B44" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#E15B44" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(27,27,25,0.08)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#1B1B19', opacity: 0.6, fontSize: 10, fontFamily: 'Space Mono' }}
                axisLine={{ stroke: '#1B1B19', strokeWidth: 1 }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                ticks={[0, 20, 40, 60, 80, 100]}
                tick={{ fill: '#1B1B19', opacity: 0.6, fontSize: 10, fontFamily: 'Space Mono' }}
                axisLine={{ stroke: '#1B1B19', strokeWidth: 1 }}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border-2 border-[#1B1B19] p-3 shadow-xl font-['Inter'] text-xs min-w-[200px]">
                        <div className="font-['Space_Mono'] font-bold text-xs uppercase tracking-wider text-[#1B1B19] pb-1 mb-1.5 border-b border-[rgba(27,27,25,0.15)] flex justify-between items-center">
                          <span>{data.label}</span>
                          <span className={`px-1.5 py-0.2 text-[9px] uppercase font-bold ${data.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-[#E15B44]'}`}>
                            {data.isCorrect ? 'Correct' : 'Missed'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#1B1B19]/70 mb-1">
                          <strong>Subject:</strong> {data.subject}
                        </div>
                        <div className="text-[11px] text-[#1B1B19]/70 mb-2">
                          <strong>Mode:</strong> {data.mode}
                        </div>
                        <div className="pt-1.5 border-t border-[rgba(27,27,25,0.1)] flex justify-between font-['Space_Mono']">
                          <span className="text-[#1B1B19]/60">Cumulative:</span>
                          <strong className="text-[#E15B44] text-sm">{data.cumulativeAccuracy}%</strong>
                        </div>
                        <div className="flex justify-between font-['Space_Mono'] text-[10px] text-[#1B1B19]/70">
                          <span>Rolling (5-Q):</span>
                          <strong>{data.rollingAccuracy}%</strong>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Benchmark Reference Line at 80% */}
              <ReferenceLine
                y={80}
                stroke="#E15B44"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: '80% Benchmark',
                  fill: '#E15B44',
                  fontSize: 10,
                  fontFamily: 'Space Mono',
                  position: 'insideTopRight',
                }}
              />
              {/* Rolling 5-Q Average */}
              <Line
                type="monotone"
                dataKey="rollingAccuracy"
                name="Rolling 5-Q"
                stroke="#1B1B19"
                strokeWidth={1.5}
                dot={false}
              />
              {/* Cumulative Accuracy with Gradient Fill */}
              <Area
                type="monotone"
                dataKey="cumulativeAccuracy"
                name="Cumulative Score"
                stroke="#E15B44"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#scoreGradient)"
                dot={{ r: 3, fill: '#E15B44', stroke: '#FFFFFF', strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: '#E15B44', stroke: '#1B1B19', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 pt-3 border-t border-[rgba(27,27,25,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-['Space_Mono'] text-[10px] text-[#1B1B19]/60 uppercase tracking-wider">
          <span>Target Requirement: Consistent performance sustained $\ge 80\%$ before official CLEP testing.</span>
          <span>Sample Size: {timelineData.length} Attempts Evaluated</span>
        </div>
      </div>

      {/* SECONDARY ROW: Subject Competency Bar Chart & Category Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subject Breakdown Horizontal Bar Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white border-2 border-[#1B1B19] p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[rgba(27,27,25,0.12)]">
            <div>
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold block mb-1">
                Discipline Mastery
              </span>
              <h3 className="font-['Space_Mono'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#1B1B19]">
                Subject Competency vs. 80% Benchmark
              </h3>
            </div>
            <div className="font-['Space_Mono'] text-[10px] text-[#1B1B19]/60">
              {subjectBreakdownData.length} Subjects Evaluated
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectBreakdownData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(27,27,25,0.08)" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 80, 100]}
                  tick={{ fill: '#1B1B19', opacity: 0.6, fontSize: 10, fontFamily: 'Space Mono' }}
                  axisLine={{ stroke: '#1B1B19', strokeWidth: 1 }}
                  tickLine={false}
                  unit="%"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#1B1B19', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={{ stroke: '#1B1B19', strokeWidth: 1 }}
                  tickLine={false}
                  width={140}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white border-2 border-[#1B1B19] p-3 shadow-xl font-['Inter'] text-xs">
                          <div className="font-['Space_Mono'] font-bold text-xs uppercase text-[#1B1B19] pb-1 border-b border-[rgba(27,27,25,0.15)] mb-1.5">
                            {data.name}
                          </div>
                          <div className="flex justify-between gap-4 py-0.5">
                            <span className="text-[#1B1B19]/70">Accuracy:</span>
                            <strong className={`font-['Space_Mono'] ${data.isPassing ? 'text-emerald-700' : 'text-[#E15B44]'}`}>
                              {data.accuracy}%
                            </strong>
                          </div>
                          <div className="flex justify-between gap-4 py-0.5 text-[#1B1B19]/60">
                            <span>Score:</span>
                            <span className="font-['Space_Mono']">{data.correct} / {data.total} Correct</span>
                          </div>
                          <div className="pt-1 mt-1 border-t border-[rgba(27,27,25,0.1)] text-[10px] font-['Space_Mono'] uppercase">
                            Status: <strong className={data.isPassing ? 'text-emerald-700' : 'text-[#E15B44]'}>
                              {data.isPassing ? 'Benchmark Satisfied' : 'Below 80% Target'}
                            </strong>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  x={80}
                  stroke="#E15B44"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
                <Bar dataKey="accuracy" radius={[0, 2, 2, 0]}>
                  {subjectBreakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.accuracy >= 80 ? '#047857' : '#E15B44'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-3 border-t border-[rgba(27,27,25,0.08)] flex items-center justify-between text-[11px] text-[#1B1B19]/70 font-['Space_Mono']">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#047857]" /> Passing (≥80%)
              <span className="w-2.5 h-2.5 bg-[#E15B44] ml-2" /> Needs Review (&lt;80%)
            </span>
            <span>Dotted Red Line = 80% Benchmark</span>
          </div>
        </div>

        {/* Academic Categories Radar / Distribution (1 Col) */}
        <div className="bg-white border-2 border-[#1B1B19] p-5 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(27,27,25,0.12)]">
              <div>
                <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold block mb-1">
                  Core Balance
                </span>
                <h3 className="font-['Space_Mono'] text-base font-bold uppercase tracking-tight text-[#1B1B19]">
                  Category Radar
                </h3>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius="70%" data={categoryRadarData}>
                  <PolarGrid stroke="rgba(27,27,25,0.12)" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: '#1B1B19', fontSize: 10, fontFamily: 'Space Mono' }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: '#1B1B19', opacity: 0.5, fontSize: 9 }}
                  />
                  <Radar
                    name="Score %"
                    dataKey="score"
                    stroke="#E15B44"
                    fill="#E15B44"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[rgba(27,27,25,0.08)] font-['Space_Mono'] text-[10px] text-[#1B1B19]/70 leading-relaxed">
            Multidisciplinary balance across humanities, STEM, language, and quantitative college topics.
          </div>
        </div>
      </div>

      {/* THIRD SECTION: Weak Spot Diagnostics & Recommended Actionable Drills */}
      <div className="bg-white border-2 border-[#1B1B19] p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-5 border-b border-[rgba(27,27,25,0.12)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#E15B44]" />
                <span>Targeted Intervention</span>
              </span>
              <span className="text-[#1B1B19]/30 font-['Space_Mono'] text-xs">/</span>
              <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">Chapters Below Benchmark</span>
            </div>
            <h3 className="font-['Space_Mono'] text-base sm:text-lg font-bold uppercase tracking-tight text-[#1B1B19]">
              Recommended Focus Areas (Weak Spot Interventions)
            </h3>
          </div>

          <div className="font-['Space_Mono'] text-xs text-[#1B1B19]/70">
            {weakSpotAreas.length} Target Topics Identified
          </div>
        </div>

        {weakSpotAreas.length === 0 ? (
          <div className="p-8 text-center bg-[#F8F7F4] border border-[rgba(27,27,25,0.12)] text-[#1B1B19]">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
            <div className="font-['Space_Mono'] font-bold text-sm uppercase">All Evaluated Topics Meet Passing Standard (≥80%)</div>
            <p className="text-xs text-[#1B1B19]/70 mt-1 max-w-md mx-auto">
              Outstanding work. Your current history demonstrates readiness across tested chapters. Maintain velocity with full CLEP mock examinations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {weakSpotAreas.map((area, idx) => (
              <div
                key={idx}
                className="p-4 border border-[rgba(27,27,25,0.18)] bg-[#F8F7F4] flex flex-col justify-between hover:border-[#1B1B19] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[rgba(27,27,25,0.1)]">
                    <span className="font-['Space_Mono'] text-[9px] uppercase tracking-wider text-[#E15B44] font-bold truncate max-w-[150px]">
                      {area.subjectName}
                    </span>
                    <span className="font-['Space_Mono'] text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-[#E15B44] border border-[#E15B44]/30">
                      {area.accuracy}% Pass Rate
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs sm:text-sm text-[#1B1B19] leading-snug mb-1">
                    {area.chapter}
                  </h4>
                  <div className="text-[11px] text-[#1B1B19]/60 font-['Space_Mono']">
                    {area.correct} correct of {area.total} attempt{area.total > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(27,27,25,0.08)] flex justify-end">
                  {onStartSubjectDrill && (
                    <button
                      type="button"
                      onClick={() => onStartSubjectDrill(area.subjectId)}
                      className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#1B1B19] hover:text-[#E15B44] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Drill Topic</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
