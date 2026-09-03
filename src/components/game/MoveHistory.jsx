import React, { useState, useEffect, useRef } from 'react';
import { Swords, AlertTriangle, Crown, ListFilter } from 'lucide-react';
import styles from './MoveHistory.module.css';

const PIECE_NAMES = {
  p: 'Pawn',
  n: 'Knight',
  b: 'Bishop',
  r: 'Rook',
  q: 'Queen',
  k: 'King'
};

export function MoveHistory({ history = [], currentMoveIndex = -1, onSelectMove }) {
  const [filterMode, setFilterMode] = useState('highlights'); // 'highlights' (default) | 'all'
  const scrollRef = useRef(null);

  // Extract only Key Events: Captures ("when we cut any pieces"), Checks, and Checkmates
  const keyEvents = history
    .map((move, index) => ({
      move,
      index,
      turnNum: Math.floor(index / 2) + 1,
      isWhite: move.color === 'w',
      isCapture: !!move.captured || move.san.includes('x'),
      isCheck: move.san.includes('+'),
      isCheckmate: move.san.includes('#')
    }))
    .filter((item) => {
      if (filterMode === 'all') return true;
      return item.isCapture || item.isCheck || item.isCheckmate;
    });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history.length, currentMoveIndex]);

  const getEventTag = (item) => {
    if (item.isCheckmate) {
      return {
        label: 'Checkmate',
        icon: Crown,
        className: styles.tagCheckmate
      };
    }
    if (item.isCheck && item.isCapture) {
      const target = item.move.captured ? PIECE_NAMES[item.move.captured] : 'Piece';
      return {
        label: `Took ${target} + Check`,
        icon: Swords,
        className: styles.tagDanger
      };
    }
    if (item.isCheck) {
      return {
        label: 'Check',
        icon: AlertTriangle,
        className: styles.tagCheck
      };
    }
    if (item.isCapture) {
      const target = item.move.captured ? PIECE_NAMES[item.move.captured] : 'Piece';
      return {
        label: `Captured ${target}`,
        icon: Swords,
        className: styles.tagCapture
      };
    }
    return {
      label: 'Move',
      icon: null,
      className: styles.tagNeutral
    };
  };

  return (
    <div className={styles.container}>
      {/* Header with Filter Pill */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Swords size={16} className={styles.headerIcon} />
          <span className={styles.headerTitle}>
            {filterMode === 'highlights' ? 'Battle Highlights (Captures & Checks)' : 'All Move Notations'}
          </span>
        </div>

        <button
          className={styles.filterBtn}
          onClick={() => setFilterMode(filterMode === 'highlights' ? 'all' : 'highlights')}
          title="Toggle view"
        >
          <ListFilter size={14} />
          <span>{filterMode === 'highlights' ? 'Show All' : 'Only Captures & Checks'}</span>
        </button>
      </div>

      {/* Events List */}
      <div className={styles.list} ref={scrollRef}>
        {keyEvents.length === 0 ? (
          <div className={styles.empty}>
            {filterMode === 'highlights'
              ? 'No captures or checks yet. Moves that cut pieces or attack the King will be recorded here.'
              : 'No moves recorded yet.'}
          </div>
        ) : (
          keyEvents.map((item) => {
            const tag = getEventTag(item);
            const TagIcon = tag.icon;
            const isSelected = currentMoveIndex === item.index;

            return (
              <div
                key={item.index}
                className={`${styles.eventRow} ${isSelected ? styles.eventSelected : ''}`}
                onClick={() => onSelectMove && onSelectMove(item.index)}
              >
                <span className={styles.turnLabel}>T{item.turnNum}</span>

                <div className={styles.playerTag}>
                  <span className={item.isWhite ? styles.whiteGlyph : styles.blackGlyph}>
                    {item.isWhite ? '♔' : '♚'}
                  </span>
                  <span className={styles.moveSan}>{item.move.san}</span>
                </div>

                <div className={`${styles.badge} ${tag.className}`}>
                  {TagIcon && <TagIcon size={13} className={styles.badgeIcon} />}
                  <span>{tag.label}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}