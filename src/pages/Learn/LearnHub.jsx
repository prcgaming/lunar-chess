import React, { useState, useEffect } from 'react';
import { LESSONS, LESSON_CATEGORIES } from '../../lessons/lessonData';
import { LessonViewer } from './LessonViewer';
import { getCompletedLessons } from '../../utilities/storage';
import { useSound } from '../../context/SoundContext';
import { BookOpen, CheckCircle, Award, Play, ChevronRight, Sparkles, Trophy, ListOrdered, ArrowUp } from 'lucide-react';
import styles from './Learn.module.css';

export function LearnHub() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completed, setCompleted] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { playSound } = useSound();

  useEffect(() => {
    setCompleted(getCompletedLessons());
  }, []);

  const handleLessonSelect = (lesson) => {
    playSound('click');
    setSelectedLesson(lesson);
  };

  const handleNextLesson = () => {
    if (!selectedLesson) return;
    const currentIndex = LESSONS.findIndex((l) => l.id === selectedLesson.id);
    if (currentIndex < LESSONS.length - 1) {
      setSelectedLesson(LESSONS[currentIndex + 1]);
    }
  };

  const handleCompletedUpdate = (id) => {
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const scrollToIndex = () => {
    playSound('click');
    const el = document.getElementById('academy-index');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (selectedLesson) {
    const currentIndex = LESSONS.findIndex((l) => l.id === selectedLesson.id);
    const hasNext = currentIndex < LESSONS.length - 1;
    const nextTitle = hasNext ? LESSONS[currentIndex + 1].title : null;

    return (
      <LessonViewer
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onNextLesson={handleNextLesson}
        hasNextLesson={hasNext}
        nextLessonTitle={nextTitle}
        isCompleted={completed.includes(selectedLesson.id)}
        onCompletedUpdate={handleCompletedUpdate}
      />
    );
  }

  const completionPercent = Math.round((completed.length / LESSONS.length) * 100);

  // Compute Mastery Rank
  let rankName = 'Apprentice Novice';
  let rankEmoji = '🥉';
  if (completed.length >= 19) {
    rankName = 'Grandmaster Scholar';
    rankEmoji = '👑';
  } else if (completed.length >= 12) {
    rankName = 'Tactical Master';
    rankEmoji = '🥇';
  } else if (completed.length >= 5) {
    rankName = 'Club Scholar';
    rankEmoji = '🥈';
  }

  // Next unfinished lesson to resume
  const nextLesson = LESSONS.find((l) => !completed.includes(l.id)) || LESSONS[0];

  const filteredCategories = selectedCategory === 'all'
    ? LESSON_CATEGORIES
    : LESSON_CATEGORIES.filter((c) => c.id === selectedCategory);

  return (
    <div className={styles.hubContainer}>
      {/* Academy Hero Banner */}
      <div className={styles.hubHeader}>
        <div className={styles.badge}>
          <Sparkles size={14} />
          <span>Interactive Masterclasses</span>
        </div>

        <h2 className={styles.hubTitle}>Lunar Chess Academy</h2>
        <p className={styles.hubSubtitle}>
          Master chess from ground zero to grandmaster tactics with interactive boards, real-time drills, and concept quizzes.
        </p>

        {/* Progress & Rank Card */}
        <div className={styles.progressCard}>
          <div className={styles.progressTop}>
            <div className={styles.rankBadge}>
              <span className={styles.rankEmoji}>{rankEmoji}</span>
              <div className={styles.rankInfo}>
                <span className={styles.rankLabel}>Mastery Level:</span>
                <strong className={styles.rankTitle}>{rankName}</strong>
              </div>
            </div>

            <div className={styles.fractionWrap}>
              <span className={styles.progressFraction}>
                {completed.length} / {LESSONS.length} Mastered ({completionPercent}%)
              </span>
            </div>
          </div>

          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${completionPercent}%` }} />
          </div>
        </div>

        {/* Quick Resume Card */}
        <div className={styles.resumeCard} onClick={() => handleLessonSelect(nextLesson)}>
          <div className={styles.resumeIconWrap}>
            <Play size={20} fill="currentColor" />
          </div>
          <div className={styles.resumeText}>
            <span className={styles.resumeLabel}>Continue Learning:</span>
            <strong className={styles.resumeLessonTitle}>{nextLesson.title}</strong>
            <p className={styles.resumeSubtitle}>{nextLesson.subtitle}</p>
          </div>
          <button className={styles.resumeActionBtn}>
            <span>Start</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Academy Course Index Header */}
      <div className={styles.indexHeader} id="academy-index">
        <ListOrdered size={16} />
        <span>Academy Course Index</span>
      </div>

      {/* Category Filter Pills */}
      <div className={styles.filterBar}>
        <button
          className={`${styles.filterPill} ${selectedCategory === 'all' ? styles.filterPillActive : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All Topics ({LESSONS.length})
        </button>
        {LESSON_CATEGORIES.map((cat) => {
          const count = LESSONS.filter((l) => l.category === cat.id).length;
          return (
            <button
              key={cat.id}
              className={`${styles.filterPill} ${selectedCategory === cat.id ? styles.filterPillActive : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Category Groups */}
      <div className={styles.categoryList}>
        {filteredCategories.map((cat) => {
          const categoryLessons = LESSONS.filter((l) => l.category === cat.id);
          const catCompleted = categoryLessons.filter((l) => completed.includes(l.id)).length;

          return (
            <div key={cat.id} className={styles.categorySection}>
              <div className={styles.catHeader}>
                <div>
                  <h3 className={styles.catName}>{cat.name}</h3>
                  <span className={styles.catDesc}>{cat.desc}</span>
                </div>
                <span className={styles.catScore}>
                  {catCompleted} / {categoryLessons.length}
                </span>
              </div>

              <div className={styles.lessonGrid}>
                {categoryLessons.map((lesson) => {
                  const isDone = completed.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className={`${styles.lessonCard} ${isDone ? styles.lessonDone : ''}`}
                      onClick={() => handleLessonSelect(lesson)}
                    >
                      <div className={styles.lessonCardHeader}>
                        <h4 className={styles.lessonCardTitle}>{lesson.title}</h4>
                        {isDone ? (
                          <span className={styles.doneBadge} title="Completed">
                            <CheckCircle size={16} /> Done
                          </span>
                        ) : (
                          <span className={styles.startBadge}>Start ▶</span>
                        )}
                      </div>

                      <p className={styles.lessonCardDesc}>{lesson.subtitle}</p>

                      <div className={styles.cardFooterRow}>
                        <span className={styles.durationTag}>~2 mins</span>
                        <span className={styles.categoryTag}>{cat.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Compact Back to Index Button at Bottom of Each Section */}
              <div className={styles.sectionBottomBar}>
                <button
                  className={styles.backToIndexBtn}
                  onClick={scrollToIndex}
                  title="Return to Course Index"
                >
                  <ArrowUp size={12} />
                  <span>Index</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}