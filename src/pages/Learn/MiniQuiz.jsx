import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { useSound } from '../../context/SoundContext';
import styles from './Learn.module.css';

export function MiniQuiz({ quiz, onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const { playSound } = useSound();

  const handleSelect = (index) => {
    if (submitted) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
    const isCorrect = selectedOption === quiz.correctIndex;
    playSound(isCorrect ? 'victory' : 'check');
    if (isCorrect && onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  const isCorrect = selectedOption === quiz.correctIndex;

  return (
    <div className={styles.quizCard}>
      <div className={styles.quizHeader}>
        <HelpCircle className={styles.quizIcon} size={22} />
        <h4 className={styles.quizTitle}>Concept Check</h4>
      </div>

      <p className={styles.questionText}>{quiz.question}</p>

      <div className={styles.optionsList}>
        {quiz.options.map((option, index) => {
          let stateClass = '';
          if (submitted) {
            if (index === quiz.correctIndex) stateClass = styles.correctOption;
            else if (index === selectedOption) stateClass = styles.wrongOption;
          } else if (index === selectedOption) {
            stateClass = styles.selectedOption;
          }

          return (
            <button
              key={index}
              className={`${styles.optionBtn} ${stateClass}`}
              onClick={() => handleSelect(index)}
              disabled={submitted}
            >
              <span className={styles.optionIndex}>{String.fromCharCode(65 + index)}</span>
              <span className={styles.optionContent}>{option}</span>
              {submitted && index === quiz.correctIndex && (
                <CheckCircle2 size={18} className={styles.checkIcon} />
              )}
              {submitted && index === selectedOption && index !== quiz.correctIndex && (
                <XCircle size={18} className={styles.crossIcon} />
              )}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <div className={`${styles.feedbackBox} ${isCorrect ? styles.feedbackSuccess : styles.feedbackError}`}>
          <strong>{isCorrect ? '🎉 Correct!' : '❌ Not quite right!'}</strong>
          <p>{quiz.explanation}</p>
          {!isCorrect && (
            <Button variant="secondary" size="sm" onClick={handleReset} className={styles.retryBtn}>
              Try Again
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.quizActions}>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            Submit Answer
          </Button>
        </div>
      )}
    </div>
  );
}
