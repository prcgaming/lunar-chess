import React, { useState, useEffect, useRef } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, BookOpen, Target, HelpCircle, CheckCircle2, ChevronRight, Play, RotateCcw, Award } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ChessboardView } from '../../components/board/ChessboardView';
import { InteractiveLessonBoard } from './InteractiveLessonBoard';
import { MiniQuiz } from './MiniQuiz';
import { markLessonCompleted } from '../../utilities/storage';
import { useSound } from '../../context/SoundContext';
import styles from './Learn.module.css';

export function LessonViewer({ lesson, onBack, onNextLesson, hasNextLesson, nextLessonTitle, isCompleted, onCompletedUpdate }) {
  const [activeStep, setActiveStep] = useState(1); // 1 = Theory & Demo, 2 = Practice Drill, 3 = Quiz
  const [practiceDone, setPracticeDone] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [demoFen, setDemoFen] = useState(lesson.demoFen);
  const [demoLastMove, setDemoLastMove] = useState(null);
  const [isDemoPlayed, setIsDemoPlayed] = useState(false);
  const [boardWidth, setBoardWidth] = useState(360);

  const demoWrapRef = useRef(null);
  const { playSound } = useSound();

  // Responsive board calculation for Demo
  useEffect(() => {
    const updateSize = () => {
      if (demoWrapRef.current) {
        const width = demoWrapRef.current.offsetWidth;
        setBoardWidth(Math.min(420, Math.max(280, width - 24)));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [activeStep]);

  // Reset demo state when lesson changes
  useEffect(() => {
    setDemoFen(lesson.demoFen);
    setDemoLastMove(null);
    setIsDemoPlayed(false);
    setPracticeDone(false);
    setQuizDone(false);
    setActiveStep(1);
  }, [lesson]);

  // Handle playing demonstration move
  const handlePlayDemo = () => {
    if (!lesson.practice?.expectedMove) return;
    try {
      const g = new Chess(lesson.demoFen);
      const move = g.move(lesson.practice.expectedMove);
      if (move) {
        setDemoFen(g.fen());
        setDemoLastMove(lesson.practice.expectedMove);
        setIsDemoPlayed(true);
        playSound('move');
      }
    } catch {
      // Fallback
    }
  };

  const handleResetDemo = () => {
    setDemoFen(lesson.demoFen);
    setDemoLastMove(null);
    setIsDemoPlayed(false);
    playSound('click');
  };

  const handlePracticeFinish = () => {
    setPracticeDone(true);
  };

  const handleQuizFinish = () => {
    setQuizDone(true);
    markLessonCompleted(lesson.id);
    if (onCompletedUpdate) onCompletedUpdate(lesson.id);
  };

  return (
    <div className={styles.viewerContainer}>
      {/* Top Header */}
      <div className={styles.viewerHeader}>
        <button className={styles.backBtn} onClick={onBack}>
          <ArrowLeft size={20} />
          <span>All Academy Lessons</span>
        </button>
        {isCompleted && (
          <div className={styles.completedTag}>
            <CheckCircle2 size={16} />
            <span>Mastered</span>
          </div>
        )}
      </div>

      {/* Lesson Title */}
      <div className={styles.titleSection}>
        <h2 className={styles.lessonTitle}>{lesson.title}</h2>
        <p className={styles.lessonSubtitle}>{lesson.subtitle}</p>
      </div>

      {/* Step Indicator Bar */}
      <div className={styles.stepProgressContainer}>
        <div
          className={`${styles.stepPill} ${activeStep === 1 ? styles.stepPillActive : ''} ${activeStep > 1 ? styles.stepPillDone : ''}`}
          onClick={() => setActiveStep(1)}
        >
          <span className={styles.stepNum}>1</span>
          <span className={styles.stepName}>Concept & Demo</span>
        </div>

        <div className={styles.stepConnector} />

        <div
          className={`${styles.stepPill} ${activeStep === 2 ? styles.stepPillActive : ''} ${practiceDone || activeStep > 2 ? styles.stepPillDone : ''}`}
          onClick={() => setActiveStep(2)}
        >
          <span className={styles.stepNum}>2</span>
          <span className={styles.stepName}>Interactive Drill</span>
        </div>

        <div className={styles.stepConnector} />

        <div
          className={`${styles.stepPill} ${activeStep === 3 ? styles.stepPillActive : ''} ${quizDone ? styles.stepPillDone : ''}`}
          onClick={() => setActiveStep(3)}
        >
          <span className={styles.stepNum}>3</span>
          <span className={styles.stepName}>Knowledge Quiz</span>
        </div>
      </div>

      {/* Step 1: Concept & Demonstration */}
      {activeStep === 1 && (
        <div className={styles.stepLayout}>
          <div className={styles.theorySide}>
            <div className={styles.theoryBox}>
              <h3 className={styles.sectionHeading}>
                <BookOpen size={20} />
                <span>The Core Principle</span>
              </h3>
              <div className={styles.markdownBody}>
                {lesson.theory.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <div className={styles.stepActionBtnWrap}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  playSound('click');
                  setActiveStep(2);
                }}
                icon={Target}
              >
                Start Interactive Drill →
              </Button>
            </div>
          </div>

          <div className={styles.demoSide} ref={demoWrapRef}>
            <div className={styles.demoHeaderRow}>
              <h4 className={styles.demoTitle}>Demonstration Board</h4>
              <div className={styles.demoControls}>
                {!isDemoPlayed ? (
                  <Button
                    variant="glass"
                    size="sm"
                    onClick={handlePlayDemo}
                    icon={Play}
                  >
                    Play Move Demo
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleResetDemo}
                    icon={RotateCcw}
                  >
                    Reset Demo
                  </Button>
                )}
              </div>
            </div>

            <div className={styles.demoBoardWrap}>
              <ChessboardView
                fen={demoFen}
                lastMove={demoLastMove}
                boardWidth={boardWidth}
                arePiecesDraggable={false}
              />
            </div>
            <p className={styles.demoCaption}>
              {isDemoPlayed
                ? 'Move demonstrated! Notice how the piece executes this rule.'
                : 'Click "Play Move Demo" to see the rule executed in real-time.'}
            </p>
          </div>
        </div>
      )}

      {/* Step 2: Interactive Drill */}
      {activeStep === 2 && (
        <div className={styles.practiceStepContainer}>
          <InteractiveLessonBoard
            practice={lesson.practice}
            onComplete={handlePracticeFinish}
          />

          <div className={styles.stepFooterRow}>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setActiveStep(1)}
              icon={ArrowLeft}
            >
              Back to Concept
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={() => {
                playSound('click');
                setActiveStep(3);
              }}
              icon={HelpCircle}
            >
              Proceed to Quiz →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Knowledge Check (Quiz) */}
      {activeStep === 3 && (
        <div className={styles.quizStepContainer}>
          <MiniQuiz
            quiz={lesson.quiz}
            onComplete={handleQuizFinish}
          />

          {quizDone && (
            <div className={styles.masteryCelebrationCard}>
              <div className={styles.celebrationIconWrap}>
                <Award size={36} className={styles.celebrationAward} />
              </div>
              <h3 className={styles.celebrationTitle}>Lesson Mastered!</h3>
              <p className={styles.celebrationDesc}>
                You have thoroughly learned and demonstrated understanding of <strong>"{lesson.title}"</strong>.
              </p>

              <div className={styles.celebrationActions}>
                {hasNextLesson ? (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onNextLesson}
                    icon={ChevronRight}
                  >
                    Next Lesson: {nextLessonTitle || 'Continue'} →
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onBack}
                    icon={CheckCircle2}
                  >
                    Graduate to Academy Hub
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="md"
                  onClick={onBack}
                >
                  Return to All Lessons
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}