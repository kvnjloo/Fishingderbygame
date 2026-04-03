import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { QUESTIONS } from '../utils/constants';

interface QuestionScreenProps {
  level: number;
  questionNumber: number;
  onAnswer: (answerIndex: number, isCorrect: boolean, timeRemaining: number) => void;
}

export function QuestionScreen({ level, questionNumber, onAnswer }: QuestionScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = QUESTIONS[questionNumber]; // Use questionNumber instead of level - 1

  useEffect(() => {
    if (isAnswered) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up - auto-answer as wrong
          setIsAnswered(true);
          setTimeout(() => {
            onAnswer(-1, false, 0);
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAnswered, onAnswer]);

  // Play tick sound at 10 seconds
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0 && !isAnswered) {
      // Visual feedback only (no actual sound)
    }
  }, [timeRemaining, isAnswered]);

  const handleAnswer = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === question.correctAnswer;

    setTimeout(() => {
      onAnswer(index, isCorrect, timeRemaining);
    }, 1500);
  };

  const getAnswerClass = (index: number) => {
    if (!isAnswered) {
      return 'bg-gray-700 hover:bg-gray-600 border-gray-600';
    }
    if (index === question.correctAnswer) {
      return 'bg-green-600 border-green-500';
    }
    if (index === selectedAnswer) {
      return 'bg-red-600 border-red-500';
    }
    return 'bg-gray-800 border-gray-700 opacity-50';
  };

  const isUrgent = timeRemaining <= 5;
  const isTicking = timeRemaining <= 10;

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-purple-950 flex items-center justify-center z-10 p-4 overflow-hidden">
      <div className="w-full h-full flex flex-col justify-center" style={{ maxWidth: '700px', maxHeight: '100%' }}>
        {/* Header */}
        <div className="text-center mb-4 flex-shrink-0">
          <div className="text-yellow-400 text-lg md:text-xl font-bold mb-1 font-mono">
            LEVEL {level} QUESTION
          </div>
          <div className="text-cyan-300 text-sm md:text-base font-mono">
            Answer quickly for bonus points!
          </div>
        </div>

        {/* Timer */}
        <div
          className={`mb-4 flex-shrink-0 transition-all ${
            isUrgent ? 'animate-bounce' : isTicking ? 'animate-pulse' : ''
          }`}
        >
          <div
            className={`bg-black p-2 md:p-3 rounded-lg border-2 md:border-4 ${
              isUrgent ? 'border-red-500' : isTicking ? 'border-yellow-500' : 'border-blue-500'
            } flex items-center justify-center gap-2`}
          >
            <Clock
              className={`w-5 h-5 md:w-6 md:h-6 ${
                isUrgent ? 'text-red-400' : isTicking ? 'text-yellow-400' : 'text-blue-400'
              }`}
            />
            <div
              className={`text-3xl md:text-4xl font-mono font-bold ${
                isUrgent ? 'text-red-400' : isTicking ? 'text-yellow-400' : 'text-blue-400'
              }`}
              style={{ textShadow: '0 0 20px currentColor' }}
            >
              {timeRemaining}s
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-3 md:p-4 rounded-lg border-2 md:border-4 border-cyan-700 mb-3 md:mb-4 flex-shrink-0">
          <div className="text-white text-sm md:text-base lg:text-lg font-bold text-center leading-snug">
            {question.question}
          </div>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 gap-2 md:gap-3 flex-1 overflow-y-auto min-h-0">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`${getAnswerClass(
                index
              )} text-white px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 md:border-4 font-bold text-xs md:text-sm lg:text-base transition-colors disabled:cursor-not-allowed text-left flex-shrink-0`}
            >
              <div className="flex items-center gap-2">
                <div className="bg-white/20 px-2 py-0.5 rounded font-mono text-xs md:text-sm flex-shrink-0">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="break-words">{answer}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Urgent warning */}
        {isUrgent && !isAnswered && (
          <div className="mt-3 bg-red-900/50 border border-red-500 rounded-lg p-2 flex items-center justify-center gap-2 animate-pulse flex-shrink-0">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0" />
            <div className="text-red-400 font-bold font-mono text-xs md:text-sm">HURRY! TIME IS RUNNING OUT!</div>
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-400 flex-shrink-0" />
          </div>
        )}

        {/* Result feedback */}
        {isAnswered && selectedAnswer !== null && (
          <div className="mt-3 text-center flex-shrink-0">
            {selectedAnswer === question.correctAnswer ? (
              <div className="bg-green-900/50 border border-green-500 rounded-lg p-2 md:p-3">
                <div className="text-green-400 text-base md:text-lg lg:text-xl font-bold font-mono">
                  ✓ CORRECT! +{Math.floor(100 + (timeRemaining / 30) * 200)} POINTS
                </div>
              </div>
            ) : (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-2 md:p-3">
                <div className="text-red-400 text-base md:text-lg lg:text-xl font-bold font-mono">
                  ✗ WRONG! -50 POINTS
                </div>
              </div>
            )}
          </div>
        )}

        {/* Time's up message */}
        {isAnswered && selectedAnswer === null && (
          <div className="mt-3 text-center bg-orange-900/50 border border-orange-500 rounded-lg p-2 md:p-3 flex-shrink-0">
            <div className="text-orange-400 text-base md:text-lg lg:text-xl font-bold font-mono">
              ⏰ TIME'S UP! -50 POINTS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}