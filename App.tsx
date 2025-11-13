
import React, { useState, useCallback, useEffect } from 'react';
import { getQuestions } from './services/quizData';
import type { Question, UserAnswer } from './types';
import QuizCard from './components/QuizCard';
import ScoreScreen from './components/ScoreScreen';
import QuestionList from './components/QuestionList';
import EditQuestionForm from './components/EditQuestionForm';
import CategorySelectionScreen from './components/CategorySelectionScreen';
import CategoryQuestionViewer from './components/CategoryQuestionViewer';


type QuizState = 'landing' | 'active' | 'finished' | 'category-select' | 'category-view';
const LOCAL_STORAGE_KEY = 'germanAviationQuizQuestions';

const App: React.FC = () => {
  const [quizState, setQuizState] = useState<QuizState>('landing');
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const storedQuestions = localStorage.getItem(LOCAL_STORAGE_KEY);
        let data: Question[];
        if (storedQuestions) {
          data = JSON.parse(storedQuestions);
        } else {
          data = await getQuestions();
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
        const sortedQuestions = data.sort((a, b) => a.id - b.id);
        setAllQuestions(sortedQuestions);
        
        const uniqueCategories = [...new Set(sortedQuestions.map(q => q.code.split('-')[0]))].sort();
        setCategories(uniqueCategories);

      } catch (err) {
        console.error(err);
        setError('Failed to load quiz questions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const startQuiz = useCallback(() => {
    if (allQuestions.length === 0) return;
    setQuestions(allQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setUserAnswers({});
    setQuizState('active');
    setEditingQuestionId(null);
  }, [allQuestions]);

  const handleViewByCategory = () => {
    setQuizState('category-select');
  };

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setQuizState('category-view');
  };

  const handleBackToLanding = () => {
    setQuizState('landing');
    setSelectedCategory(null);
  };
  
  const handleBackToCategories = () => {
      setSelectedCategory(null);
      setQuizState('category-select');
  }


  const handleAnswer = (answerLetter: string) => {
    if (isAnswered) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerLetter === currentQuestion.correctAnswer;

    setSelectedAnswer(answerLetter);
    setIsAnswered(true);
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        selected: answerLetter,
        isCorrect: isCorrect,
      }
    }));
    
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleSelectQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    const questionId = questions[index].id;
    const answered = userAnswers[questionId];

    if (answered) {
        setSelectedAnswer(answered.selected);
        setIsAnswered(true);
    } else {
        setSelectedAnswer(null);
        setIsAnswered(false);
    }
  };

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      handleSelectQuestion(nextIndex);
    } else {
      setQuizState('finished');
    }
  };
  
  const handleEditQuestion = (questionId: number) => {
    setEditingQuestionId(questionId);
  };

  const handleSaveQuestion = (updatedQuestion: Question) => {
    const updatedQuestions = allQuestions.map(q =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setAllQuestions(updatedQuestions);
    setQuestions(updatedQuestions);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedQuestions));
    setEditingQuestionId(null);
  };
  
  const handleCancelEdit = () => {
    setEditingQuestionId(null);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center text-xl text-slate-400">Loading questions...</div>
      );
    }

    if (error) {
      return (
        <div className="text-center bg-slate-800 p-8 rounded-xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
          <p className="text-lg text-slate-300">{error}</p>
        </div>
      );
    }

    switch (quizState) {
      case 'landing':
        return (
          <div className="text-center bg-slate-800/70 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-slate-700">
            <h1 className="text-4xl font-bold mb-4 text-cyan-400">German Aviation Quiz</h1>
            <p className="text-lg text-slate-300 mb-8">Test your knowledge with {allQuestions.length} questions.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={startQuiz}
                disabled={allQuestions.length === 0}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                Start Quiz
              </button>
              <button
                onClick={handleViewByCategory}
                disabled={allQuestions.length === 0}
                className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 disabled:bg-slate-700 disabled:cursor-not-allowed"
              >
                View by Category
              </button>
            </div>
          </div>
        );
      case 'category-select':
        return (
          <CategorySelectionScreen 
            categories={categories}
            onSelectCategory={handleSelectCategory}
            onBack={handleBackToLanding}
          />
        );
      
      case 'category-view':
        if (!selectedCategory) return null;
        const filteredQuestions = allQuestions.filter(q => q.code.startsWith(selectedCategory));
        return (
          <CategoryQuestionViewer
            category={selectedCategory}
            questions={filteredQuestions}
            onBack={handleBackToCategories}
          />
        );
      case 'active':
        if (questions.length === 0) return null;
        const questionToEdit = editingQuestionId !== null
            ? allQuestions.find(q => q.id === editingQuestionId)
            : undefined;

        return (
          <div className="flex flex-col md:flex-row gap-8 w-full items-start">
            <div className="w-full md:w-2/3">
              {questionToEdit ? (
                <EditQuestionForm 
                  question={questionToEdit}
                  onSave={handleSaveQuestion}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <QuizCard
                  question={questions[currentQuestionIndex]}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  onAnswer={handleAnswer}
                  onNext={handleNextQuestion}
                  onEdit={handleEditQuestion}
                  selectedAnswer={selectedAnswer}
                  isAnswered={isAnswered}
                />
              )}
            </div>
            <div className="w-full md:w-1/3">
               <QuestionList
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                onQuestionSelect={handleSelectQuestion}
                userAnswers={userAnswers}
              />
            </div>
          </div>
        );
      case 'finished':
        return (
          <ScoreScreen
            score={score}
            totalQuestions={questions.length}
            onRestart={startQuiz}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className={`min-h-screen w-full flex items-center justify-center p-4 ${quizState !== 'landing' ? 'bg-gradient-to-br from-slate-900 to-gray-900' : ''}`}
      style={quizState === 'landing' ? {
        backgroundImage: `url('https://storage.googleapis.com/aistudio-hosting/history/1719234855776/01HZB3W37N17B3N0089064B98E/01HZB3W47854619R41QYEQM65A.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : {}}
    >
      <main className={`w-full mx-auto ${quizState === 'active' || quizState === 'category-view' ? 'max-w-7xl' : 'max-w-2xl'}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
