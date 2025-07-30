import React, { useState, useEffect } from 'react';
import { Heart, X, RotateCcw, BookOpen, TrendingUp, Settings, ArrowLeft, Calendar, Clock, Target } from 'lucide-react';

const VocabularyApp = () => {
  // 날짜별 단어 데이터셋
  const [wordSets] = useState([
    {
      id: 1,
      title: "July 30th",
      description: "Complex words for advanced learners",
      wordCount: 5,
      difficulty: "Advanced",
      completed: false,
      words: [
        {
          id: 1,
          word: "Serendipity",
          pronunciation: "/ˌserənˈdipədē/",
          meaning: "Pleasant surprise or fortunate accident",
          example: "Finding this book was pure serendipity.",
          difficulty: "Advanced"
        },
        {
          id: 2,
          word: "Ephemeral",
          pronunciation: "/əˈfem(ə)rəl/",
          meaning: "Lasting for a very short time",
          example: "The beauty of cherry blossoms is ephemeral.",
          difficulty: "Advanced"
        },
        {
          id: 3,
          word: "Ubiquitous",
          pronunciation: "/yo͞oˈbikwədəs/",
          meaning: "Present, appearing, or found everywhere",
          example: "Smartphones have become ubiquitous in modern society.",
          difficulty: "Advanced"
        },
        {
          id: 4,
          word: "Mellifluous",
          pronunciation: "/məˈliflo͞oəs/",
          meaning: "Sweet or musical; pleasant to hear",
          example: "Her mellifluous voice captivated the audience.",
          difficulty: "Advanced"
        },
        {
          id: 5,
          word: "Procrastinate",
          pronunciation: "/prəˈkrastəˌnāt/",
          meaning: "Delay or postpone action",
          example: "Don't procrastinate on your homework.",
          difficulty: "Advanced"
        }
      ]
    },
    {
      id: 2,
      title: "July 29th",
      description: "Essential business vocabulary",
      wordCount: 4,
      difficulty: "Intermediate",
      completed: true,
      words: [
        {
          id: 6,
          word: "Synergy",
          pronunciation: "/ˈsinərjē/",
          meaning: "The interaction of elements that produce a combined effect",
          example: "The synergy between the two departments increased productivity.",
          difficulty: "Intermediate"
        },
        {
          id: 7,
          word: "Leverage",
          pronunciation: "/ˈlevərij/",
          meaning: "Use something to maximum advantage",
          example: "We need to leverage our resources effectively.",
          difficulty: "Intermediate"
        },
        {
          id: 8,
          word: "Stakeholder",
          pronunciation: "/ˈstākˌhōldər/",
          meaning: "A person with an interest in an undertaking",
          example: "All stakeholders must be consulted before the decision.",
          difficulty: "Intermediate"
        },
        {
          id: 9,
          word: "Paradigm",
          pronunciation: "/ˈperəˌdīm/",
          meaning: "A typical example or pattern of something",
          example: "The new paradigm shift changed our approach completely.",
          difficulty: "Intermediate"
        }
      ]
    },
    {
      id: 3,
      title: "July 28th",
      description: "Common words for everyday use",
      wordCount: 6,
      difficulty: "Beginner",
      completed: true,
      words: [
        {
          id: 10,
          word: "Appreciate",
          pronunciation: "/əˈprēSHēˌāt/",
          meaning: "Recognize the value of something",
          example: "I appreciate your help with this project.",
          difficulty: "Beginner"
        },
        {
          id: 11,
          word: "Considerate",
          pronunciation: "/kənˈsidərət/",
          meaning: "Careful not to cause inconvenience or hurt to others",
          example: "She was very considerate to call before visiting.",
          difficulty: "Beginner"
        },
        {
          id: 12,
          word: "Genuine",
          pronunciation: "/ˈjenyəˌwīn/",
          meaning: "Truly what something is said to be; authentic",
          example: "His apology seemed genuine and heartfelt.",
          difficulty: "Beginner"
        },
        {
          id: 13,
          word: "Reliable",
          pronunciation: "/rəˈlīəb(ə)l/",
          meaning: "Consistently good in quality or performance",
          example: "She is a reliable friend who always keeps her promises.",
          difficulty: "Beginner"
        },
        {
          id: 14,
          word: "Enthusiastic",
          pronunciation: "/inˌTHo͞ozēˈastik/",
          meaning: "Having or showing intense and eager enjoyment",
          example: "The students were enthusiastic about the field trip.",
          difficulty: "Beginner"
        },
        {
          id: 15,
          word: "Patience",
          pronunciation: "/ˈpāSH(ə)ns/",
          meaning: "The capacity to accept or tolerate delay or trouble",
          example: "Teaching children requires a lot of patience.",
          difficulty: "Beginner"
        }
      ]
    }
  ]);

  const [currentView, setCurrentView] = useState('home'); // 'home' or 'study'
  const [selectedWordSet, setSelectedWordSet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ known: 0, unknown: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const currentWord = selectedWordSet?.words[currentIndex];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', { 
      month: 'long', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return 'from-green-400 to-emerald-500';
      case 'Intermediate': return 'from-yellow-400 to-orange-500';
      case 'Advanced': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const startStudy = (wordSet) => {
    setSelectedWordSet(wordSet);
    setCurrentView('study');
    setCurrentIndex(0);
    setIsFlipped(false);
    setStats({ known: 0, unknown: 0, total: 0 });
    setShowResult(false);
  };

  const goBackHome = () => {
    setCurrentView('home');
    setSelectedWordSet(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    setStats({ known: 0, unknown: 0, total: 0 });
    setShowResult(false);
  };

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      setStats(prev => ({ ...prev, known: prev.known + 1, total: prev.total + 1 }));
    } else {
      setStats(prev => ({ ...prev, unknown: prev.unknown + 1, total: prev.total + 1 }));
    }

    if (currentIndex < selectedWordSet.words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setShowResult(true);
    }
  };

  const resetStudy = () => {
    setCurrentIndex(0);
    setStats({ known: 0, unknown: 0, total: 0 });
    setShowResult(false);
    setIsFlipped(false);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const offsetX = e.clientX - centerX;
      setDragOffset({ x: offsetX, y: 0 });
    }
  };

  const handleMouseUp = () => {
    if (Math.abs(dragOffset.x) > 100) {
      handleSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset.x]);

  // 홈 화면
  if (currentView === 'home') {
    return (
      <div className="min-h-screen max-w-sm mx-auto bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* 헤더 */}
        <div className="p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8" />
              <h1 className="text-2xl font-bold">VocabSwipe</h1>
            </div>
            <Settings className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" />
          </div>
          <p className="text-white/80 text-sm">Choose a vocabulary set to review</p>
        </div>

        {/* 통계 카드 */}
        <div className="px-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{wordSets.reduce((acc, set) => acc + set.wordCount, 0)}</div>
                <div className="text-white/70 text-xs">Total Words</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{wordSets.filter(set => set.completed).length}</div>
                <div className="text-white/70 text-xs">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{Math.round((wordSets.filter(set => set.completed).length / wordSets.length) * 100)}%</div>
                <div className="text-white/70 text-xs">Progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* 단어 세트 목록 */}
        <div className="px-6 space-y-4">
          {wordSets.map((wordSet) => (
            <div
              key={wordSet.id}
              onClick={() => startStudy(wordSet)}
              className="bg-white rounded-2xl p-5 shadow-xl cursor-pointer transform transition-all hover:scale-105 active:scale-95"
            >
              {/* 제목 */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-gray-600" />
                  <h3 className="text-2xl font-bold text-gray-800">{wordSet.title}</h3>
                </div>
                {wordSet.completed && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* 하단 정보 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{wordSet.wordCount} words</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{Math.ceil(wordSet.wordCount * 0.5)} min</span>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getDifficultyColor(wordSet.difficulty)}`}>
                  {wordSet.difficulty}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-6"></div>
      </div>
    );
  }

  // 결과 화면
  if (showResult) {
    return (
      <div className="h-screen max-w-sm mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="bg-white rounded-3xl p-6 text-center max-w-xs w-full shadow-2xl mx-4">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete!</h2>
          <p className="text-sm text-gray-600 mb-6">{selectedWordSet.title}</p>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-xl">
              <span className="text-green-800 font-semibold text-sm">Known Words</span>
              <span className="text-xl font-bold text-green-600">{stats.known}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-100 rounded-xl">
              <span className="text-red-800 font-semibold text-sm">Unknown Words</span>
              <span className="text-xl font-bold text-red-600">{stats.unknown}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-100 rounded-xl">
              <span className="text-blue-800 font-semibold text-sm">Accuracy</span>
              <span className="text-xl font-bold text-blue-600">
                {Math.round((stats.known / stats.total) * 100)}%
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={resetStudy}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold text-base hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 active:scale-95"
            >
              Study Again
            </button>
            <button
              onClick={goBackHome}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-base hover:bg-gray-200 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 학습 화면
  return (
    <div className="h-screen max-w-sm mx-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col relative overflow-hidden">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-4 text-white relative z-10">
        <div className="flex items-center space-x-2">
          <ArrowLeft 
            className="w-6 h-6 cursor-pointer hover:scale-110 transition-transform" 
            onClick={goBackHome}
          />
          <h1 className="text-lg font-bold">{selectedWordSet.title}</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            {currentIndex + 1} / {selectedWordSet.words.length}
          </div>
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="px-4 mb-4 relative z-10">
        <div className="w-full bg-white/20 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-pink-400 to-purple-400 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / selectedWordSet.words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 메인 카드 영역 */}
      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="relative w-full max-w-xs">
          {/* 배경 카드들 */}
          {currentIndex + 1 < selectedWordSet.words.length && (
            <div className="absolute inset-0 bg-white rounded-3xl shadow-lg transform rotate-2 scale-95 opacity-40" />
          )}
          {currentIndex + 2 < selectedWordSet.words.length && (
            <div className="absolute inset-0 bg-white rounded-3xl shadow-lg transform -rotate-1 scale-90 opacity-20" />
          )}

          {/* 현재 카드 */}
          <div
            className={`relative bg-white rounded-3xl shadow-2xl cursor-grab transition-all duration-300 ${isDragging ? 'cursor-grabbing scale-105' : ''}`}
            style={{
              transform: `translateX(${dragOffset.x}px) rotate(${dragOffset.x * 0.1}deg)`,
              opacity: Math.max(0.5, 1 - Math.abs(dragOffset.x) / 300)
            }}
            onMouseDown={handleMouseDown}
          >
            {/* 스와이프 힌트 */}
            {Math.abs(dragOffset.x) > 50 && (
              <div className={`absolute top-6 ${dragOffset.x > 0 ? 'right-6' : 'left-6'} z-10`}>
                <div className={`px-3 py-2 rounded-full text-white font-bold text-sm ${dragOffset.x > 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                  {dragOffset.x > 0 ? 'I Know!' : "Don't Know!"}
                </div>
              </div>
            )}

            <div 
              className="h-80 p-6 flex flex-col justify-center items-center text-center cursor-pointer"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {!isFlipped ? (
                // 앞면 - 단어
                <div className="space-y-4">
                  <div className={`inline-block px-3 py-1 bg-gradient-to-r ${getDifficultyColor(currentWord.difficulty)} text-white rounded-full text-xs font-semibold`}>
                    {currentWord.difficulty}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                    {currentWord.word}
                  </h2>
                  <p className="text-gray-500 text-base">
                    {currentWord.pronunciation}
                  </p>
                  <div className="text-xs text-gray-400 mt-6 bg-gray-50 py-2 px-4 rounded-full">
                    Tap to see meaning
                  </div>
                </div>
              ) : (
                // 뒷면 - 뜻과 예문
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {currentWord.word}
                  </h3>
                  <p className="text-lg text-gray-700 font-semibold leading-relaxed">
                    {currentWord.meaning}
                  </p>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <p className="text-sm text-gray-600 italic leading-relaxed">
                      "{currentWord.example}"
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-50 py-2 px-4 rounded-full">
                    Now swipe your choice!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex justify-center items-center space-x-6 p-6 relative z-10">
        <button
          onClick={() => handleSwipe('left')}
          className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-red-600 hover:scale-110 transition-all active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
        
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-white/30 hover:scale-110 transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={() => handleSwipe('right')}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 hover:scale-110 transition-all active:scale-95"
        >
          <Heart className="w-7 h-7" />
        </button>
      </div>

      {/* 하단 통계 */}
      <div className="flex justify-center space-x-6 pb-6 text-white/80 relative z-10">
        <div className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full">
          <X className="w-4 h-4 text-red-400" />
          <span className="text-sm">{stats.unknown}</span>
        </div>
        <div className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full">
          <TrendingUp className="w-4 h-4 text-yellow-400" />
          <span className="text-sm">{stats.total}</span>
        </div>
        <div className="flex items-center space-x-1 bg-white/10 px-3 py-1 rounded-full">
          <Heart className="w-4 h-4 text-green-400" />
          <span className="text-sm">{stats.known}</span>
        </div>
      </div>
    </div>
  );
};

export default VocabularyApp;