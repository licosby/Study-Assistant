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

  const groupedBySubject = filteredNotes.reduce((acc, note) => {
    if (!acc[note.subjectId]) acc[note.subjectId] = [];
    acc[note.subjectId].push(note);
    return acc;
  }, {} as Record<string, StudyNote[]>);

  const handleCopyNote = (note: StudyNote) => {
    const text = `NOTE: ${note.title}\nSubject: ${note.chapter} (${note.textbookRef})\n\nSummary:\n${note.summary}\n\nHigh-Yield Takeaway:\n${note.keyTakeaway}`;
    navigator.clipboard.writeText(text);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportAll = () => {
    if (notes.length === 0) return;
    const content = notes
      .map(
        (n, i) =>
          `[NOTE #${i + 1}] ${n.title}\nChapter: ${n.chapter}\nReference: ${n.textbookRef}\nCreated: ${new Date(n.createdAt).toLocaleDateString()}\n\nSummary:\n${n.summary}\n\nKey Takeaway:\n${n.keyTakeaway}\n----------------------------------------\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CLEP_Scholar_Study_Notes_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-[#1B1B19] font-['Inter']">
      {/* Top Header Card */}
      <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[rgba(27,27,25,0.1)]">
          <div>
            <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
              Personalized Repository
            </div>
            <h2 className="font-['Space_Mono'] text-lg sm:text-xl font-bold uppercase tracking-tight text-[#1B1B19] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#E15B44]" />
              <span>Collegiate Study Notebook</span>
            </h2>
            <p className="text-xs text-[#1B1B19]/70 mt-0.5">
              High-yield concept clippings and verified OpenStax mini-lessons saved across all 3 devices.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            {notes.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleExportAll}
                  className="font-['Space_Mono'] flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-[#1B1B19] bg-white hover:bg-[#EFECE6] border border-[#1B1B19] transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export TXT</span>
                </button>
                <button
                  type="button"
                  onClick={onClearNotes}
                  className="font-['Space_Mono'] flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider text-[#E15B44] bg-white hover:bg-rose-50 border border-[#E15B44]/40 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-5">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#1B1B19]/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clipped concepts or takeaways..."
              className="w-full pl-9 pr-3 py-1.5 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs text-[#1B1B19] placeholder-[#1B1B19]/40 focus:outline-none focus:border-[#1B1B19] focus:bg-white font-['Inter']"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 border border-[rgba(27,27,25,0.2)] bg-[#F8F7F4] text-xs font-['Space_Mono'] uppercase text-[#1B1B19] focus:outline-none focus:border-[#1B1B19]"
            >
              <option value="all">All Subjects ({notes.length} Notes)</option>
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
      </div>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white border border-[rgba(27,27,25,0.15)] p-12 text-center text-[#1B1B19]/60">
          <FolderOpen className="w-10 h-10 mx-auto text-[#1B1B19]/30 mb-3" />
          <h4 className="font-['Space_Mono'] text-sm font-bold uppercase text-[#1B1B19] mb-1">Notebook is Empty</h4>
          <p className="text-xs max-w-sm mx-auto">
            While reviewing questions, click "Clip to Notes" inside any "Explain This" mini-lesson to organize study sheets here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedBySubject).map(([subId, subNotes]) => {
            const subject = ALL_SUBJECTS.find((s) => s.id === subId);
            return (
              <div key={subId} className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-[rgba(27,27,25,0.12)]">
                  <h3 className="font-['Space_Mono'] text-xs font-bold uppercase tracking-wider text-[#1B1B19]">
                    {subject?.name || 'General College Core'}
                  </h3>
                  <span className="font-['Space_Mono'] text-[10px] text-[#E15B44] font-bold">
                    ({subNotes.length} notes)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subNotes.map((note) => {
                    const isCopied = copiedId === note.id;
                    return (
                      <div
                        key={note.id}
                        className="bg-white border border-[rgba(27,27,25,0.15)] hover:border-[#1B1B19] p-5 flex flex-col justify-between transition-all shadow-2xs"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#E15B44]">
                              {note.chapter}
                            </span>
                            <span className="font-['Space_Mono'] text-[10px] text-[#1B1B19]/50">
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-bold text-[#1B1B19] mb-2 leading-snug">
                            {note.title}
                          </h4>

                          <p className="text-xs text-[#1B1B19]/80 leading-relaxed mb-3 whitespace-pre-line">
                            {note.summary}
                          </p>

                          <div className="p-3 border-l-3 border-l-[#E15B44] bg-[#F8F7F4] border border-[rgba(27,27,25,0.08)] mb-3">
                            <span className="font-['Space_Mono'] text-[10px] uppercase font-bold text-[#1B1B19] block mb-0.5">
                              Key Takeaway:
                            </span>
                            <p className="text-xs text-[#1B1B19]/90 italic">{note.keyTakeaway}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-[rgba(27,27,25,0.08)]">
                          <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/50 truncate max-w-[180px]">
                            {note.textbookRef}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleCopyNote(note)}
                              className="font-['Space_Mono'] p-1.5 border border-[rgba(27,27,25,0.2)] text-[#1B1B19] hover:bg-[#EFECE6] text-xs transition-colors cursor-pointer"
                              title="Copy Note"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => onDeleteNote(note.id)}
                              className="font-['Space_Mono'] p-1.5 border border-rose-300 text-[#E15B44] hover:bg-rose-50 text-xs transition-colors cursor-pointer"
                              title="Delete Note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
