import React, { useState } from 'react';
import { 
  Bookmark, 
  Search, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  Sparkles,
  Layers,
  FolderOpen
} from 'lucide-react';
import { StudyNote } from '../types';
import { ALL_SUBJECTS } from '../data/subjects';

interface NotebookViewProps {
  notes: StudyNote[];
  onDeleteNote: (noteId: string) => void;
  onClearNotes: () => void;
}

export const NotebookView: React.FC<NotebookViewProps> = ({
  notes,
  onDeleteNote,
  onClearNotes,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredNotes = notes.filter((note) => {
    const matchesSubject =
      selectedSubjectId === 'all' || note.subjectId === selectedSubjectId;
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.keyTakeaway.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Group notes logically by Subject
  const groupedBySubject = filteredNotes.reduce((acc, note) => {
    if (!acc[note.subjectId]) acc[note.subjectId] = [];
    acc[note.subjectId].push(note);
    return acc;
  }, {} as Record<string, StudyNote[]>);

  const handleCopyNote = (note: StudyNote) => {
    const text = `# ${note.title}\nSubject: ${note.subjectId} • ${note.chapter}\nReference: ${note.textbookRef}\n\nSummary:\n${note.summary}\n\nKey Takeaway:\n${note.keyTakeaway}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleExportAll = () => {
    if (notes.length === 0) return;
    let content = `# CLEP Scholar - University Core Study Notes Notebook\nExported: ${new Date().toLocaleDateString()}\n\n`;
    notes.forEach((note, idx) => {
      const subject = ALL_SUBJECTS.find((s) => s.id === note.subjectId);
      content += `## ${idx + 1}. ${note.title}\n`;
      content += `**Subject:** ${subject?.name || note.subjectId} | **Chapter:** ${note.chapter}\n`;
      content += `**Source:** ${note.textbookRef}\n\n`;
      content += `### Concept Breakdown\n${note.summary}\n\n`;
      content += `### High-Yield Takeaway\n> ${note.keyTakeaway}\n\n---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clep-study-notes-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bookmark className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">
                Collegiate Study Notebook & Clipped Summaries
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Summarized notes clipped directly from the "Explain This" mini-lessons, organized logically by course and chapter.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {notes.length > 0 && (
              <>
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Notes (.md)</span>
                </button>
                <button
                  onClick={onClearNotes}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your notes or takeaways..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Courses ({notes.length} notes)</option>
            {ALL_SUBJECTS.map((sub) => {
              const count = notes.filter((n) => n.subjectId === sub.id).length;
              return (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({count})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Notes List Grouped by Subject */}
      {filteredNotes.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <FolderOpen className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-white mb-1">Your Notebook is Empty</h4>
          <p className="text-xs max-w-sm mx-auto mb-4">
            While studying, click the <strong>"Explain This"</strong> button and press <strong>"Clip to Notes"</strong>. Summaries will be automatically organized here for rapid exam review!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBySubject).map(([subId, subjectNotes]) => {
            const subject = ALL_SUBJECTS.find((s) => s.id === subId);
            return (
              <div key={subId} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <h3 className="text-sm font-bold text-white">
                    {subject ? subject.name : subId}
                  </h3>
                  <span className="text-xs text-slate-500">
                    ({subjectNotes.length} notes • {subject?.textbook})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectNotes.map((note) => {
                    const isCopied = copiedId === note.id;
                    return (
                      <div
                        key={note.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 truncate">
                              {note.chapter}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleCopyNote(note)}
                                className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                                title="Copy note text"
                              >
                                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => onDeleteNote(note.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
                                title="Delete note"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                            {note.title}
                          </h4>

                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-3">
                            {note.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-800/80">
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                            <strong>Takeaway:</strong> {note.keyTakeaway}
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono block mt-2">
                            Source: {note.textbookRef}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
