import React, { useState } from 'react';
import { 
  Headphones, 
  Languages, 
  Volume2, 
  Radio, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { ForeignLanguageAudioPlayer, AudioDialogueData } from './ForeignLanguageAudioPlayer';
import { Question } from '../types';

interface AudioLabTrack {
  id: string;
  language: 'es-ES' | 'fr-FR' | 'de-DE';
  languageName: string;
  topic: string;
  level: string;
  dialogue: AudioDialogueData;
  vocabulary: { term: string; phonetic: string; meaning: string }[];
  quizQuestion: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

const AUDIO_LAB_TRACKS: AudioLabTrack[] = [
  {
    id: 'track-es-1',
    language: 'es-ES',
    languageName: 'Spanish (Castellano)',
    topic: 'En la Estación de Tren (Madrid Puerta de Atocha)',
    level: 'CLEP Level 1 / 2 Core',
    dialogue: {
      language: 'es-ES',
      speakerText: 'Pasajero: Disculpe, señorita, ¿a qué hora sale el próximo tren de alta velocidad con destino a Sevilla? Empleada: El AVE número 2140 saldrá a las cuatro y media de la tarde por el andén número tres. Por favor, recuerde validar su billete en el lector digital antes de cruzar el control de seguridad. Pasajero: Muchas gracias. ¿Lleva coche cafetería a bordo? Empleada: Sí, señor, en el coche número cuatro.',
      englishTranslation: 'Passenger: Excuse me, miss, what time does the next high-speed train to Seville leave? Agent: AVE number 2140 will depart at four-thirty in the afternoon from platform number three. Please remember to validate your ticket at the digital reader before crossing security checkpoint. Passenger: Thank you very much. Does it have a dining car on board? Agent: Yes, sir, in car number four.',
      speakers: [
        { name: 'Pasajero', line: 'Disculpe, señorita, ¿a qué hora sale el próximo tren de alta velocidad con destino a Sevilla?' },
        { name: 'Empleada', line: 'El AVE número 2140 saldrá a las cuatro y media de la tarde por el andén número tres.' },
        { name: 'Empleada', line: 'Por favor, recuerde validar su billete en el lector digital antes de cruzar el control de seguridad.' },
        { name: 'Pasajero', line: 'Muchas gracias. ¿Lleva coche cafetería a bordo?' },
        { name: 'Empleada', line: 'Sí, señor, en el coche número cuatro.' }
      ]
    },
    vocabulary: [
      { term: 'Andén', phonetic: '[an-den]', meaning: 'Train platform / track quay' },
      { term: 'Alta velocidad (AVE)', phonetic: '[al-ta be-lo-si-dad]', meaning: 'Spanish high-speed rail bullet train' },
      { term: 'Validar el billete', phonetic: '[ba-li-dar el bi-ye-te]', meaning: 'To stamp or scan digital train ticket' },
      { term: 'Coche cafetería', phonetic: '[ko-che ka-fe-te-ri-a]', meaning: 'Dining / bistro car on rail transit' }
    ],
    quizQuestion: {
      prompt: '¿Por qué andén saldrá el AVE hacia Sevilla y en qué coche se encuentra la cafetería?',
      options: [
        'Andén 3; coche cafetería en el coche número 4.',
        'Andén 4; coche cafetería en el coche número 3.',
        'Andén 2; el tren no dispone de servicio de cafetería.',
        'Andén 7; el tren sale a las 3:30 de la mañana.'
      ],
      correctIndex: 0,
      explanation: 'El diálogo indica claramente que el tren sale por el andén 3 a las cuatro y media (4:30 PM) y la cafetería se ubica en el coche 4.'
    }
  },
  {
    id: 'track-es-2',
    language: 'es-ES',
    languageName: 'Spanish (América Latina)',
    topic: 'Consulta Médica y Receta en la Farmacia',
    level: 'CLEP Conversational Standard',
    dialogue: {
      language: 'es-ES',
      speakerText: 'Doctora: Buenas tardes, Carlos. Dígame, ¿cuáles son los síntomas que ha sentido desde el martes? Carlos: He tenido fiebre moderada, dolor de garganta y mucha congestión nasal. Doctora: Bien, le voy a recetar este antibiótico cada ocho horas con las comidas durante siete días completos. Es fundamental no interrumpir el tratamiento.',
      englishTranslation: 'Doctor: Good afternoon, Carlos. Tell me, what symptoms have you experienced since Tuesday? Carlos: I have had a moderate fever, a sore throat, and heavy nasal congestion. Doctor: Very well, I am prescribing this antibiotic every eight hours with meals for seven full days. It is critical not to stop the treatment.',
      speakers: [
        { name: 'Doctora', line: 'Buenas tardes, Carlos. Dígame, ¿cuáles son los síntomas que ha sentido desde el martes?' },
        { name: 'Carlos', line: 'He tenido fiebre moderada, dolor de garganta y mucha congestión nasal.' },
        { name: 'Doctora', line: 'Bien, le voy a recetar este antibiótico cada ocho horas con las comidas durante siete días completos.' }
      ]
    },
    vocabulary: [
      { term: 'Dolor de garganta', phonetic: '[do-lor de gar-gan-ta]', meaning: 'Sore throat' },
      { term: 'Recetar', phonetic: '[re-se-tar]', meaning: 'To prescribe medication' },
      { term: 'Cada ocho horas', phonetic: '[ka-da o-cho o-ras]', meaning: 'Every eight hours (three times daily)' },
      { term: 'Tratamiento', phonetic: '[tra-ta-mjen-to]', meaning: 'Course of medical treatment' }
    ],
    quizQuestion: {
      prompt: '¿Con qué frecuencia debe tomar Carlos el antibiótico prescrito por la doctora?',
      options: [
        'Cada ocho horas con las comidas durante siete días.',
        'Una vez al día antes de dormir durante dos semanas.',
        'Únicamente si la fiebre supera los 39 grados centígrados.',
        'Cada cuatro horas con el estómago completamente vacío.'
      ],
      correctIndex: 0,
      explanation: 'La doctora especifica claramente: "cada ocho horas con las comidas durante siete días completos".'
    }
  },
  {
    id: 'track-fr-1',
    language: 'fr-FR',
    languageName: 'French (Français Métropolitain)',
    topic: 'Au Bistrot Parisien et Commande au Serveur',
    level: 'CLEP Level 1 / 2 Oral Core',
    dialogue: {
      language: 'fr-FR',
      speakerText: 'Serveur: Bonjour madame, vous avez choisi ? Cliente: Oui, je voudrais une salade niçoise et une carafe d\'eau fraîche, s\'il vous plaît. Par contre, excusez-moi, mais la table à côté est un peu trop bruyante; est-ce que je pourrais m\'installer près de la fenêtre ? Serveur: Bien sûr madame, suivez-moi.',
      englishTranslation: 'Waiter: Good day madam, have you chosen? Customer: Yes, I would like a Niçoise salad and a pitcher of cold tap water, please. However, excuse me, but the next table is a bit too loud; could I sit by the window? Waiter: Of course madam, follow me.',
      speakers: [
        { name: 'Serveur', line: 'Bonjour madame, vous avez choisi ?' },
        { name: 'Cliente', line: 'Oui, je voudrais une salade niçoise et une carafe d\'eau fraîche, s\'il vous plaît.' },
        { name: 'Cliente', line: 'Par contre, excusez-moi, mais la table à côté est un peu trop bruyante; est-ce que je pourrais m\'installer près de la fenêtre ?' },
        { name: 'Serveur', line: 'Bien sûr madame, suivez-moi.' }
      ]
    },
    vocabulary: [
      { term: 'Carafe d\'eau', phonetic: '[ka-ʁaf do]', meaning: 'Pitcher of complimentary tap water (standard dining etiquette)' },
      { term: 'Bruyant / Bruyante', phonetic: '[bʁɥi-jɑ̃ / bʁɥi-jɑ̃t]', meaning: 'Noisy / loud ambient environment' },
      { term: 'Je voudrais', phonetic: '[ʒə vu-dʁɛ]', meaning: 'Polite conditional request: "I would like"' },
      { term: 'Près de la fenêtre', phonetic: '[pʁɛ də la fə-nɛtʁ]', meaning: 'Near the window' }
    ],
    quizQuestion: {
      prompt: 'Pourquoi la cliente demande-t-elle à s\'installer près de la fenêtre ?',
      options: [
        'Parce que la table voisine est trop bruyante.',
        'Parce qu\'il fait trop chaud à l\'intérieur de la salle.',
        'Parce qu\'elle attend un collègue qui arrive en taxi.',
        'Parce que la table actuelle n\'est pas dressée avec des couverts.'
      ],
      correctIndex: 0,
      explanation: 'La cliente mentionne explicitement: "la table à côté est un peu trop bruyante".'
    }
  },
  {
    id: 'track-de-1',
    language: 'de-DE',
    languageName: 'German (Hochdeutsch)',
    topic: 'Bahnhofsdurchsage und Zugverspätung (München Hbf)',
    level: 'CLEP Hörverstehen Competency',
    dialogue: {
      language: 'de-DE',
      speakerText: 'Durchsage: Achtung an Gleis sieben! Der Intercity-Express 804 nach Berlin Hauptbahnhof über Nürnberg und Leipzig, planmäßige Abfahrt um vierzehn Uhr zwanzig, fährt heute mit einer Verspätung von etwa fünfzehn Minuten ein. Grund dafür ist eine technische Störung an der Strecke. Wir bitten alle Reisenden um Verständnis.',
      englishTranslation: 'Announcement: Attention on platform seven! Intercity-Express 804 to Berlin Central Station via Nuremberg and Leipzig, scheduled departure at 14:20, will arrive today with a delay of approximately fifteen minutes. The reason is a technical disruption on the track. We ask all passengers for their understanding.',
      speakers: [
        { name: 'Durchsage', line: 'Achtung an Gleis sieben! Der Intercity-Express 804 nach Berlin Hauptbahnhof fährt heute mit einer Verspätung von etwa fünfzehn Minuten ein.' },
        { name: 'Durchsage', line: 'Planmäßige Abfahrt war vierzehn Uhr zwanzig. Grund dafür ist eine technische Störung an der Strecke.' },
        { name: 'Durchsage', line: 'Wir bitten alle Reisenden um Verständnis.' }
      ]
    },
    vocabulary: [
      { term: 'Das Gleis (Gleis 7)', phonetic: '[ɡlaɪ̯s]', meaning: 'Train track / railway platform' },
      { term: 'Die Verspätung', phonetic: '[fɛɐ̯ˈʃpɛːtʊŋ]', meaning: 'Delay (from spät = late)' },
      { term: 'Vierzehn Uhr zwanzig', phonetic: '[ˈfɪʁt͡seːn uːɐ̯ ˈt͡svant͡sɪç]', meaning: '14:20 (2:20 PM military/European transit clock)' },
      { term: 'Technische Störung', phonetic: '[ˈtɛçnɪʃə ˈʃtøːʁʊŋ]', meaning: 'Technical fault or track disruption' }
    ],
    quizQuestion: {
      prompt: 'Welche Information bezüglich des ICE 804 nach Berlin wird durchgegeben?',
      options: [
        'Abfahrt auf Gleis 7 mit circa 15 Minuten Verspätung wegen einer Streckenstörung.',
        'Der Zug fällt komplett aus; Reisende müssen den Regionalexpress nutzen.',
        'Der Zug fährt 50 Minuten früher ab als im Fahrplan angegeben.',
        'Gleiswechsel von Gleis 7 auf Gleis 2 ohne Verspätung.'
      ],
      correctIndex: 0,
      explanation: 'Die Durchsage meldet: Gleis 7, 15 Minuten Verspätung wegen technischer Störung an der Strecke.'
    }
  }
];

export const AudioListeningLab: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'es-ES' | 'fr-FR' | 'de-DE'>('all');
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const filteredTracks = AUDIO_LAB_TRACKS.filter(
    (t) => selectedLanguage === 'all' || t.language === selectedLanguage
  );

  const activeTrack = filteredTracks[activeTrackIndex] || filteredTracks[0];

  const handleSelectTrack = (idx: number) => {
    setActiveTrackIndex(idx);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in text-[#1B1B19] font-['Inter']">
      {/* Top Banner Card */}
      <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[rgba(27,27,25,0.1)]">
          <div>
            <div className="font-['Space_Mono'] text-[10px] uppercase tracking-[0.15em] text-[#E15B44] font-bold">
              Oral Language Immersion
            </div>
            <h2 className="font-['Space_Mono'] text-lg sm:text-2xl font-bold uppercase tracking-tight text-[#1B1B19] flex items-center gap-2.5">
              <Headphones className="w-6 h-6 text-[#E15B44]" />
              <span>CLEP Foreign Language Audio Listening Lab</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#1B1B19]/70 mt-1">
              Collegiate listening comprehension training for Spanish, French, and German. Features multi-speaker acoustic dialogue, tempo modulation, blind test mode, and line-by-line speech isolating.
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto font-['Space_Mono'] text-[10px] uppercase">
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage('all');
                setActiveTrackIndex(0);
                setQuizSubmitted(false);
              }}
              className={`px-3 py-1.5 border transition-all cursor-pointer ${
                selectedLanguage === 'all'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              All Languages
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage('es-ES');
                setActiveTrackIndex(0);
                setQuizSubmitted(false);
              }}
              className={`px-3 py-1.5 border transition-all cursor-pointer ${
                selectedLanguage === 'es-ES'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              🇪🇸 Spanish
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage('fr-FR');
                setActiveTrackIndex(0);
                setQuizSubmitted(false);
              }}
              className={`px-3 py-1.5 border transition-all cursor-pointer ${
                selectedLanguage === 'fr-FR'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              🇫🇷 French
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedLanguage('de-DE');
                setActiveTrackIndex(0);
                setQuizSubmitted(false);
              }}
              className={`px-3 py-1.5 border transition-all cursor-pointer ${
                selectedLanguage === 'de-DE'
                  ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                  : 'bg-white text-[#1B1B19] border-[rgba(27,27,25,0.2)] hover:bg-[#EFECE6]'
              }`}
            >
              🇩🇪 German
            </button>
          </div>
        </div>

        {/* Track Playlist Row */}
        <div className="pt-4">
          <label className="block font-['Space_Mono'] text-[10px] uppercase tracking-wider text-[#1B1B19]/60 font-bold mb-2">
            Select Dialogue Track ({filteredTracks.length} Available):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {filteredTracks.map((tr, idx) => {
              const isCur = idx === activeTrackIndex;
              return (
                <div
                  key={tr.id}
                  onClick={() => handleSelectTrack(idx)}
                  className={`p-3.5 border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isCur
                      ? 'bg-[#1B1B19] text-white border-[#1B1B19]'
                      : 'bg-[#F8F7F4] hover:bg-[#EFECE6] border-[rgba(27,27,25,0.12)] text-[#1B1B19]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-['Space_Mono'] text-[9px] uppercase font-bold ${isCur ? 'text-[#E15B44]' : 'text-[#1B1B19]/60'}`}>
                        {tr.languageName}
                      </span>
                      <span className={`font-['Space_Mono'] text-[8px] uppercase px-1 py-0.2 border ${isCur ? 'border-white/30 text-white' : 'border-[#1B1B19]/20'}`}>
                        {tr.level.split(' ')[0]}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold leading-snug line-clamp-2">
                      {tr.topic}
                    </h4>
                  </div>
                  <span className={`font-['Space_Mono'] text-[9px] uppercase mt-2 pt-1.5 border-t ${isCur ? 'border-white/20 text-white/70' : 'border-[rgba(27,27,25,0.1)] text-[#1B1B19]/50'}`}>
                    ▶ Listen Now
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Active Audio Player Card */}
      {activeTrack && (
        <div className="space-y-6">
          <ForeignLanguageAudioPlayer
            dialogue={activeTrack.dialogue}
            subjectName={activeTrack.languageName}
            chapter={activeTrack.topic}
          />

          {/* High-Yield Acoustic Vocabulary Glossary */}
          <div className="bg-white border border-[rgba(27,27,25,0.15)] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[rgba(27,27,25,0.1)]">
              <Sparkles className="w-4 h-4 text-[#E15B44]" />
              <h3 className="font-['Space_Mono'] text-xs uppercase font-bold text-[#1B1B19] tracking-wider">
                Acoustic Lexicon & High-Yield Oral Vocabulary ({activeTrack.vocabulary.length} Keys)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activeTrack.vocabulary.map((v, i) => (
                <div key={i} className="p-3 border border-[rgba(27,27,25,0.12)] bg-[#F8F7F4]">
                  <div className="font-['Space_Mono'] text-xs font-bold text-[#1B1B19]">
                    {v.term}
                  </div>
                  <div className="font-['Space_Mono'] text-[10px] text-[#E15B44] mb-1">
                    {v.phonetic}
                  </div>
                  <div className="text-xs text-[#1B1B19]/80 leading-snug">
                    {v.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Acoustic Comprehension Self-Test */}
          <div className="bg-white border-2 border-[#1B1B19] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1B1B19]">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#E15B44]" />
                <h3 className="font-['Space_Mono'] text-xs sm:text-sm uppercase font-bold text-[#1B1B19] tracking-wider">
                  Listening Comprehension Verification Quiz
                </h3>
              </div>
              <span className="font-['Space_Mono'] text-[10px] uppercase text-[#1B1B19]/60">
                CLEP Exam Question Protocol
              </span>
            </div>

            <p className="text-sm sm:text-base font-medium text-[#1B1B19] mb-5 leading-snug">
              {activeTrack.quizQuestion.prompt}
            </p>

            <div className="space-y-2.5 mb-6">
              {activeTrack.quizQuestion.options.map((opt, i) => {
                const isSelected = selectedQuizAnswer === i;
                const isRight = i === activeTrack.quizQuestion.correctIndex;

                let optClass = 'border-[rgba(27,27,25,0.15)] hover:border-[#1B1B19] bg-white';
                if (quizSubmitted) {
                  if (isRight) {
                    optClass = 'border-emerald-700 bg-emerald-50 text-emerald-950 font-medium';
                  } else if (isSelected && !isRight) {
                    optClass = 'border-[#E15B44] bg-rose-50 text-rose-950 font-medium';
                  }
                } else if (isSelected) {
                  optClass = 'border-[#1B1B19] bg-[#EFECE6] text-[#1B1B19] font-medium';
                }

                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (!quizSubmitted) setSelectedQuizAnswer(i);
                    }}
                    className={`p-3.5 border transition-all flex items-center justify-between gap-3 cursor-pointer ${optClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-['Space_Mono'] w-5 h-5 border border-[#1B1B19] flex items-center justify-center text-xs font-bold uppercase shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-xs sm:text-sm">{opt}</span>
                    </div>

                    {quizSubmitted && isRight && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[rgba(27,27,25,0.1)]">
              {quizSubmitted ? (
                <div className="text-xs text-[#1B1B19]/80 italic">
                  <strong>Verification Rationale:</strong> {activeTrack.quizQuestion.explanation}
                </div>
              ) : (
                <span className="text-xs text-[#1B1B19]/60">
                  Select your answer based on the spoken audio cues above.
                </span>
              )}

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                {quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedQuizAnswer(null);
                    }}
                    className="font-['Space_Mono'] px-4 py-2 border border-[#1B1B19] text-xs uppercase tracking-wider hover:bg-[#EFECE6] transition-colors cursor-pointer"
                  >
                    Retry Quiz
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={selectedQuizAnswer === null}
                    onClick={() => setQuizSubmitted(true)}
                    className="font-['Space_Mono'] px-5 py-2 bg-[#1B1B19] hover:bg-[#E15B44] text-white text-xs uppercase font-bold tracking-wider border border-[#1B1B19] transition-all cursor-pointer disabled:opacity-40"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
