import React from 'react';

// Generates 3D and 2D Custom Pieces for react-chessboard
// Supports: '2d-standard', '2d-alpha', '3d-wood', '3d-gold'

function createPieceSvg({ type, color, style, width }) {
  const isWhite = color === 'w';
  const is3D = style.startsWith('3d');

  // Palette definitions
  let fillGradientId = `grad-${style}-${color}-${type}`;
  let filterId = `filter-${style}-${color}`;

  // Color parameters
  let mainTop, mainMid, mainBot, strokeColor, shadowColor, rimLight;

  if (style === '3d-wood') {
    if (isWhite) {
      mainTop = '#fff9ed';
      mainMid = '#e8d3b0';
      mainBot = '#b38f59';
      strokeColor = '#7a5a2e';
      shadowColor = 'rgba(70, 45, 20, 0.45)';
      rimLight = '#ffffff';
    } else {
      mainTop = '#4a3321';
      mainMid = '#281a0e';
      mainBot = '#170e07';
      strokeColor = '#0f0803';
      shadowColor = 'rgba(0, 0, 0, 0.6)';
      rimLight = '#82593b';
    }
  } else if (style === '3d-gold') {
    if (isWhite) {
      // 24k Burnished Gold
      mainTop = '#fff2b3';
      mainMid = '#e5b324';
      mainBot = '#946c05';
      strokeColor = '#5e4300';
      shadowColor = 'rgba(120, 90, 0, 0.45)';
      rimLight = '#fffbe6';
    } else {
      // Obsidian Crystal with Silver Rim
      mainTop = '#383e4a';
      mainMid = '#161920';
      mainBot = '#080a0e';
      strokeColor = '#000000';
      shadowColor = 'rgba(0, 0, 0, 0.7)';
      rimLight = '#38bdf8';
    }
  } else if (style === '2d-alpha') {
    if (isWhite) {
      mainTop = '#ffffff';
      mainMid = '#f1f5f9';
      mainBot = '#cbd5e1';
      strokeColor = '#334155';
      shadowColor = 'rgba(0, 0, 0, 0.15)';
      rimLight = '#ffffff';
    } else {
      mainTop = '#1e293b';
      mainMid = '#0f172a';
      mainBot = '#020617';
      strokeColor = '#000000';
      shadowColor = 'rgba(0, 0, 0, 0.3)';
      rimLight = '#64748b';
    }
  }

  // Piece Vector Paths
  const getPiecePaths = () => {
    switch (type.toLowerCase()) {
      case 'p': // Pawn
        return (
          <g>
            {/* Pedestal Base */}
            <ellipse cx="50" cy="84" rx="26" ry="7" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Lower tier */}
            <path d="M30 84 C30 74 38 72 40 68 C42 64 36 58 37 54 C38 50 43 48 45 44" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M28 84 C28 72 38 70 41 55 C39 52 42 47 45 44 L55 44 C58 47 61 52 59 55 C62 70 72 72 72 84 Z" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Head Sphere */}
            <circle cx="50" cy="32" r="15" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Specular Highlight */}
            {is3D && <ellipse cx="46" cy="28" rx="5" ry="3.5" fill={rimLight} opacity="0.65" />}
            {is3D && <path d="M36 82 C44 80 56 80 64 82" stroke={rimLight} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />}
          </g>
        );

      case 'n': // Knight
        return (
          <g>
            {/* Pedestal Base */}
            <ellipse cx="50" cy="85" rx="27" ry="7" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Knight Silhouette */}
            <path
              d="M26 84 C26 72 32 68 30 58 C28 50 25 44 26 38 C27 31 34 26 40 20 C42 16 46 12 52 14 C56 16 57 20 56 24 C62 23 68 26 72 32 C75 37 73 45 68 49 C63 53 58 54 58 58 C58 64 68 68 74 84 Z"
              fill={`url(#${fillGradientId})`}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            {/* Eye & Mane details */}
            <circle cx="44" cy="28" r="2.5" fill={strokeColor} />
            <path d="M52 24 C50 32 52 40 50 48" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M38 38 C34 42 34 46 36 50" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            {/* 3D Sheen */}
            {is3D && <path d="M42 22 C48 20 54 22 55 26" stroke={rimLight} strokeWidth="2" strokeLinecap="round" opacity="0.6" />}
          </g>
        );

      case 'b': // Bishop
        return (
          <g>
            {/* Base */}
            <ellipse cx="50" cy="85" rx="26" ry="7" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Body */}
            <path d="M30 84 C30 72 38 68 40 58 C42 48 34 38 41 24 C45 16 55 16 59 24 C66 38 58 48 60 58 C62 68 70 72 70 84 Z" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Miter cut */}
            <path d="M46 26 L56 36" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            {/* Small top cross/ball */}
            <circle cx="50" cy="16" r="4" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2" />
            {is3D && <ellipse cx="46" cy="34" rx="4" ry="8" fill={rimLight} opacity="0.4" />}
          </g>
        );

      case 'r': // Rook
        return (
          <g>
            {/* Base */}
            <ellipse cx="50" cy="85" rx="27" ry="7" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Castle Tower Body */}
            <path d="M31 84 L36 44 L64 44 L69 84 Z" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Castle Battlements / Crenellations */}
            <path d="M30 44 L30 26 L38 26 L38 33 L46 33 L46 26 L54 26 L54 33 L62 33 L62 26 L70 26 L70 44 Z" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {is3D && <line x1="38" y1="46" x2="38" y2="80" stroke={rimLight} strokeWidth="2" opacity="0.4" />}
            {is3D && <line x1="33" y1="44" x2="67" y2="44" stroke={rimLight} strokeWidth="1.5" opacity="0.6" />}
          </g>
        );

      case 'q': // Queen
        return (
          <g>
            {/* Base */}
            <ellipse cx="50" cy="85" rx="28" ry="7.5" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Royal Flared Gown */}
            <path d="M30 84 C30 70 38 64 40 52 C42 40 33 34 32 32 L40 40 L45 28 L50 40 L55 28 L60 40 L68 32 C67 34 58 40 60 52 C62 64 70 70 70 84 Z" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Crown Orbs */}
            <circle cx="32" cy="30" r="3.5" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="45" cy="26" r="3.5" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="50" cy="22" r="4" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="55" cy="26" r="3.5" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="68" cy="30" r="3.5" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="1.5" />
            {is3D && <ellipse cx="50" cy="56" rx="6" ry="14" fill={rimLight} opacity="0.35" />}
          </g>
        );

      case 'k': // King
        return (
          <g>
            {/* Base */}
            <ellipse cx="50" cy="85" rx="28" ry="7.5" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Robe / Body */}
            <path d="M30 84 C30 68 38 62 40 50 C42 38 35 34 36 28 C37 24 44 24 50 24 C56 24 63 24 64 28 C65 34 58 38 60 50 C62 62 70 68 70 84 Z" fill={`url(#${fillGradientId})`} stroke={strokeColor} strokeWidth="2.5" />
            {/* Crown Arch */}
            <path d="M38 28 C42 22 58 22 62 28" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            {/* Royal Cross on Top */}
            <path d="M50 12 L50 24 M44 16 L56 16" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            {is3D && <ellipse cx="50" cy="54" rx="7" ry="16" fill={rimLight} opacity="0.35" />}
            {is3D && <circle cx="50" cy="18" r="2.5" fill={rimLight} opacity="0.7" />}
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={width || '100%'}
      height={width || '100%'}
      style={{
        overflow: 'visible',
        filter: is3D ? `drop-shadow(0 6px 10px ${shadowColor})` : 'none',
        transform: is3D ? 'scale(1.04) translateY(-2px)' : 'none',
        transition: 'transform 0.15s ease'
      }}
    >
      <defs>
        {/* Dimensional Vertical Linear Gradient */}
        <linearGradient id={fillGradientId} x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor={mainTop} />
          <stop offset="45%" stopColor={mainMid} />
          <stop offset="100%" stopColor={mainBot} />
        </linearGradient>

        {/* Ambient bottom shadow for 3D realism */}
        {is3D && (
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor={shadowColor} />
          </filter>
        )}
      </defs>

      {/* 3D Pedestal Floor Shadow */}
      {is3D && (
        <ellipse cx="50" cy="88" rx="26" ry="6" fill="rgba(0, 0, 0, 0.35)" filter="blur(2px)" />
      )}

      {/* Main Piece Geometry */}
      {getPiecePaths()}
    </svg>
  );
}

// Generate the customPieces mapping for react-chessboard
export function getCustomPieces(style = '2d-standard') {
  if (style === '2d-standard') {
    // Returns undefined so react-chessboard uses its built-in standard SVG set
    return undefined;
  }

  const pieceTypes = ['p', 'n', 'b', 'r', 'q', 'k'];
  const colors = ['w', 'b'];
  const pieces = {};

  colors.forEach((color) => {
    pieceTypes.forEach((type) => {
      const key = `${color}${type.toUpperCase()}`;
      pieces[key] = ({ squareWidth }) =>
        createPieceSvg({
          type,
          color,
          style,
          width: squareWidth
        });
    });
  });

  return pieces;
}