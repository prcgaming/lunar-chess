import React, { useState, useEffect } from 'react';
import { LESSONS, LESSON_CATEGORIES } from '../../lessons/lessonData';
import { LessonViewer } from './LessonViewer';
import { getCompletedLessons } from '../../utilities/storage';
import { BookOpen, CheckCircle, Award } from 'lucide-react';
import styles from './Learn.module.css';

export function LearnHub() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    setCompleted(getCompletedLessons());
  }, []);

  const handleLessonSelect = (lesson) => {
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

  if (selectedLesson) {
    const currentIndex = LESSONS.findIndex((l) => l.id === selectedLesson.id);
    return (
      <LessonViewer
        lesson={selectedLesson}
        onBack={() => setSelectedLesson(null)}
        onNextLesson={handleNextLesson}
        hasNextLesson={currentIndex < LESSONS.length - 1}
        isCompleted={completed.includes(selectedLesson.id)}
        onCompletedUpdate={handleCompletedUpdate}
      />
    );
  }

  const completionPercent = Math.round((completed.length / LESSONS.length) * 100);

  return (
    <div className={styles.hubContainer}>
      {/* Academy Banner */}
      <div className={styles.hubHeader}>
        <div className={styles.hubIcon}>
          <BookOpen size={32} />
        </div>
        <h2 className={styles.hubTitle}>Lunar Chess Academy</h2>
        <p className={styles.hubSubtitle}>
          Master chess from ground zero to master tactics across 23 interactive lessons.
        </p>

        {/* Progress Bar */}
        <div className={styles.progressCard}>
          <div className={styles.progressTop}>
            <div className={styles.progressLabel}>
              <Award size={18} className={styles.awardIcon} />
              <span>Academy Progress</span>
            </div>
            <span className={styles.progressFraction}>
              {completed.length} / {LESSONS.length} Lessons ({completionPercent}%)
            </span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${completionPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Category Groups */}
      <div className={styles.categoryList}>
        {LESSON_CATEGORIES.map((cat) => {
          const categoryLessons = LESSONS.filter((l) => l.category === cat.id);
          return (
            <div key={cat.id} className={styles.categorySection}>
              <div className={styles.catHeader}>
                <h3 className={styles.catName}>{cat.name}</h3>
                <span className={styles.catDesc}>{cat.desc}</span>
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
                        {isDone && <CheckCircle size={18} className={styles.doneIcon} />}
                      </div>
                      <p className={styles.lessonCardSub}>{lesson.subtitle}</p>
                      <div className={styles.lessonCardFooter}>
                        <span>Interactive Practice & Quiz</span>
                        <span className={styles.arrow}>→</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
