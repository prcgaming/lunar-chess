import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Target, HelpCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ChessboardView } from '../../components/board/ChessboardView';
import { InteractiveLessonBoard } from './InteractiveLessonBoard';
import { MiniQuiz } from './MiniQuiz';
import { markLessonCompleted } from '../../utilities/storage';
import styles from './Learn.module.css';

export function LessonViewer({ lesson, onBack, onNextLesson, hasNextLesson, isCompleted, onCompletedUpdate }) {
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' | 'practice' | 'quiz'

  const handleLessonFinish = () => {
    markLessonCompleted(lesson.id);
    if (onCompletedUpdate) onCompletedUpdate(lesson.id);
  };

  return (
    <div className={styles.viewerContainer}>
      {/* Top Header */}
      <div className={styles.viewerHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          <span>All Lessons</span>
        </button>
        {isCompleted && (
          <div className={styles.completedTag}>
            <CheckCircle2 size={16} />
            <span>Completed</span>
          </div>
        )}
      </div>

      <div className={styles.titleSection}>
        <h2 className={styles.lessonTitle}>{lesson.title}</h2>
        <p className={styles.lessonSubtitle}>{lesson.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabsNav}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'theory' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          <BookOpen size={18} />
          <span>Explanation</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'practice' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <Target size={18} />
          <span>Interactive Practice</span>
        </button>

        <button
          className={`${styles.tabBtn} ${activeTab === 'quiz' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          <HelpCircle size={18} />
          <span>Mini Quiz</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className={styles.tabContent}>
        {activeTab === 'theory' && (
          <div className={styles.theoryPane}>
            <div className={styles.markdownBody}>
              {lesson.theory.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {lesson.demoFen && (
              <div className={styles.demoSection}>
                <h4 className={styles.demoTitle}>Demonstration Board</h4>
                <div className={styles.demoBoardWrap}>
                  <ChessboardView
                    fen={lesson.demoFen}
                    boardWidth={320}
                    arePiecesDraggable={false}
                  />
                </div>
              </div>
            )}

            <div className={styles.tabFooter}>
              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveTab('practice')}
                icon={Target}
              >
                Try Interactive Practice
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className={styles.practicePane}>
            <InteractiveLessonBoard
              practice={lesson.practice}
              onComplete={handleLessonFinish}
            />
            <div className={styles.tabFooter}>
              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveTab('quiz')}
                icon={HelpCircle}
              >
                Proceed to Quiz
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className={styles.quizPane}>
            <MiniQuiz
              quiz={lesson.quiz}
              onComplete={handleLessonFinish}
            />
            {hasNextLesson && (
              <div className={styles.nextLessonWrap}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onNextLesson}
                  icon={ChevronRight}
                >
                  Next Lesson
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
