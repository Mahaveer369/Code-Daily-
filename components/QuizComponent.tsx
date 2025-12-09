
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface Props {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

const QuizComponent: React.FC<Props> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentQ = questions[currentIndex];

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    let newScore = score;
    if (idx === currentQ.correctAnswerIndex) {
      newScore += 1;
      setScore(newScore);
    }

    // Auto advance after delay
    // setTimeout(() => handleNext(newScore), 2000); 
    // Commented out to let user read explanation
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
       setCurrentIndex(currentIndex + 1);
       setSelectedOption(null);
       setIsAnswered(false);
    } else {
       setCompleted(true);
       onComplete(score);
    }
  };

  if (completed) {
     return (
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center animate-fadeIn">
           <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
              {score === questions.length ? '🏆' : score > 0 ? '👍' : '📚'}
           </div>
           <h3 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h3>
           <p className="text-gray-400 mb-6">You scored {score} out of {questions.length}</p>
           <button className="px-6 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50">
              Module Complete
           </button>
        </div>
     );
  }

  return (
    <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 transition-all">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
             <span className="bg-blue-500/20 text-blue-400 p-1.5 rounded text-sm">Q{currentIndex + 1}</span>
             Knowledge Check
          </h3>
          <div className="text-sm text-gray-500 font-mono">
             {currentIndex + 1} / {questions.length}
          </div>
       </div>

       <div className="mb-6">
         <p className="text-lg text-gray-200 leading-relaxed">{currentQ.question}</p>
       </div>

       <div className="grid gap-3 mb-6">
          {currentQ.options.map((opt, idx) => {
             let stateClass = 'bg-gray-700 border-gray-600 hover:bg-gray-600';
             if (isAnswered) {
                if (idx === currentQ.correctAnswerIndex) stateClass = 'bg-green-500/20 border-green-500 text-green-200';
                else if (idx === selectedOption) stateClass = 'bg-red-500/20 border-red-500 text-red-200';
                else stateClass = 'bg-gray-700/50 border-gray-700 opacity-50';
             }
             
             return (
               <button 
                 key={idx} 
                 onClick={() => handleOptionClick(idx)} 
                 disabled={isAnswered} 
                 className={`p-4 rounded-lg text-left font-medium border transition-all ${stateClass}`}
               >
                 <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                       isAnswered && idx === currentQ.correctAnswerIndex ? 'border-green-500 bg-green-500 text-black' : 'border-gray-500'
                    }`}>
                       {String.fromCharCode(65 + idx)}
                    </div>
                    {opt}
                 </div>
               </button>
             )
          })}
       </div>

       {isAnswered && (
          <div className="animate-fadeIn">
             <div className={`p-4 rounded-lg mb-4 ${selectedOption === currentQ.correctAnswerIndex ? 'bg-green-900/20 border border-green-900' : 'bg-red-900/20 border border-red-900'}`}>
                <div className="font-bold mb-1 text-sm uppercase tracking-wider text-gray-400">Explanation</div>
                <p className="text-gray-300 text-sm">{currentQ.explanation}</p>
             </div>
             <div className="flex justify-end">
                <button onClick={handleNext} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-2">
                   {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
             </div>
          </div>
       )}
    </section>
  );
};

export default QuizComponent;
