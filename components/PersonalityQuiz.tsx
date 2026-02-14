
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { PERSONALITY_QUESTIONS } from '../constants';

interface Props {
  onComplete: (answers: string[]) => void;
}

const PersonalityQuiz: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (trait: string) => {
    const newAnswers = [...answers, trait];
    setAnswers(newAnswers);
    if (step < PERSONALITY_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const progress = ((step + 1) / PERSONALITY_QUESTIONS.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto py-20 animate-fadeIn">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-pink-400 font-bold uppercase tracking-widest text-xs">Step {step + 1} of {PERSONALITY_QUESTIONS.length}</span>
            <h2 className="text-3xl font-black mt-1">Personality Insight</h2>
          </div>
          <span className="text-gray-500 text-sm font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="glass-card rounded-[2.5rem] p-10 shadow-2xl">
        <h3 className="text-2xl font-bold mb-10 leading-snug">
          {PERSONALITY_QUESTIONS[step].question}
        </h3>

        <div className="space-y-4">
          {PERSONALITY_QUESTIONS[step].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(option.trait)}
              className="w-full p-6 rounded-2xl bg-white/5 border border-white/10 text-left hover:bg-white/10 hover:border-pink-500/30 transition-all flex items-center justify-between group"
            >
              <span className="text-lg font-medium">{option.text}</span>
              <ChevronRight className="text-gray-600 group-hover:text-pink-500 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalityQuiz;
