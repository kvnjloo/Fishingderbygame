import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { QUESTIONS } from '../utils/constants';

interface QuestionScreenProps {
  level: number;
  onAnswer: (answerIndex: number, isCorrect: boolean, timeRemaining: number) => void;
}

export function QuestionScreen({ level, onAnswer }: QuestionScreenProps) {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = QUESTIONS[level - 1];

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
    <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-purple-950 flex items-center justify-center z-10 p-8">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-yellow-400 text-2xl font-bold mb-2 font-mono">
            LEVEL {level} QUESTION
          </div>
          <div className="text-cyan-300 text-lg font-mono">
            Answer quickly for bonus points!
          </div>
        </div>

        {/* Timer */}
        <div
          className={`mb-6 transition-all ${
            isUrgent ? 'animate-bounce' : isTicking ? 'animate-pulse' : ''
          }`}
        >
          <div
            className={`bg-black p-4 rounded-lg border-4 ${
              isUrgent ? 'border-red-500' : isTicking ? 'border-yellow-500' : 'border-blue-500'
            } flex items-center justify-center gap-3`}
          >
            <Clock
              className={`w-8 h-8 ${
                isUrgent ? 'text-red-400' : isTicking ? 'text-yellow-400' : 'text-blue-400'
              }`}
            />
            <div
              className={`text-5xl font-mono font-bold ${
                isUrgent ? 'text-red-400' : isTicking ? 'text-yellow-400' : 'text-blue-400'
              }`}
              style={{ textShadow: '0 0 20px currentColor' }}
            >
              {timeRemaining}s
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-lg border-4 border-cyan-700 mb-6">
          <div className="text-white text-xl font-bold text-center leading-relaxed">
            {question.question}
          </div>
        </div>

        {/* Answers */}
        <div className="grid grid-cols-1 gap-4">
          {question.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`${getAnswerClass(
                index
              )} text-white px-6 py-4 rounded-lg border-4 font-bold text-lg transition-all transform hover:scale-102 disabled:cursor-not-allowed text-left`}
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 px-3 py-1 rounded font-mono">
                  {String.fromCharCode(65 + index)}
                </div>
                <div>{answer}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Urgent warning */}
        {isUrgent && !isAnswered && (
          <div className="mt-6 bg-red-900/50 border-2 border-red-500 rounded-lg p-4 flex items-center justify-center gap-3 animate-pulse">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <div className="text-red-400 font-bold font-mono">HURRY! TIME IS RUNNING OUT!</div>
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
        )}

        {/* Result feedback */}
        {isAnswered && selectedAnswer !== null && (
          <div className="mt-6 text-center">
            {selectedAnswer === question.correctAnswer ? (
              <div className="bg-green-900/50 border-2 border-green-500 rounded-lg p-4">
                <div className="text-green-400 text-2xl font-bold font-mono">
                  ✓ CORRECT! +{Math.floor(100 + (timeRemaining / 30) * 200)} POINTS
                </div>
              </div>
            ) : (
              <div className="bg-red-900/50 border-2 border-red-500 rounded-lg p-4">
                <div className="text-red-400 text-2xl font-bold font-mono">
                  ✗ WRONG! -50 POINTS
                </div>
              </div>
            )}
          </div>
        )}

        {/* Time's up message */}
        {isAnswered && selectedAnswer === null && (
          <div className="mt-6 text-center bg-orange-900/50 border-2 border-orange-500 rounded-lg p-4">
            <div className="text-orange-400 text-2xl font-bold font-mono">
              ⏰ TIME'S UP! -50 POINTS
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
