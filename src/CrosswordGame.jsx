import React, { useState, useRef } from 'react';
import { useCrosswordGrid, words, GRID_SIZE } from './hooks/useCrosswordGrid';

const colors = {
  primary: '#B39EB5',
  secondary: '#E0D6FF',
  accent: '#E7D0F5',
  background: '#F5F3FF',
  text: '#4A148C',
  light: '#EFDFF9',
  grid: '#D7BDE2',
  highlight: '#CE93D8',
  black: '#2E1A47',
};

const ResultModal = ({ message, onClose }) => {
  return (
    <div style={modalStyles.backdrop}>
      <div style={modalStyles.modal}>
        <div style={modalStyles.content}>
          <p style={modalStyles.message}>{message}</p>
          <button onClick={onClose} style={modalStyles.button}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

const CrosswordGame = () => {
  const solution = useCrosswordGrid();

  const [grid, setGrid] = useState(() =>
    Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(''))
  );
  const [activeCell, setActiveCell] = useState({ row: 0, col: 0 });
  const [direction, setDirection] = useState('horizontal');
  const [showClues, setShowClues] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [modalInfo, setModalInfo] = useState({ show: false, message: '' });
  const inputRefs = useRef({});

  const handleCellClick = (row, col) => {
    if (solution.isWhite[row][col]) {
      setActiveCell({ row, col });
      inputRefs.current[`${row}_${col}`]?.focus();
    }
  };

  const handleInputChange = (row, col, value) => {
    if (!solution.isWhite[row][col] || value.length > 1) return;
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value.toUpperCase().replace(/[^A-ZÀ-Ú]/g, '');
    setGrid(newGrid);

    setTimeout(() => {
      let nextRow = row;
      let nextCol = col;
      if (direction === 'horizontal') {
        nextCol = col + 1;
        while (nextCol < GRID_SIZE && !solution.isWhite[row][nextCol]) {
          nextCol++;
        }
      } else if (direction === 'vertical') {
        nextRow = row + 1;
        while (nextRow < GRID_SIZE && !solution.isWhite[nextRow][col]) {
          nextRow++;
        }
      }

      if ((direction === 'horizontal' && nextCol < GRID_SIZE) || (direction === 'vertical' && nextRow < GRID_SIZE)) {
        setActiveCell({ row: nextRow, col: nextCol });
        inputRefs.current[`${nextRow}_${nextCol}`]?.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e, row, col) => {
    if (/^[a-zA-ZÀ-Úà-ú]$/.test(e.key)) {
      e.preventDefault();
      handleInputChange(row, col, e.key);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = '';
      setGrid(newGrid);

      if (direction === 'horizontal' && col > 0 && solution.isWhite[row][col - 1]) {
        setActiveCell({ row, col: col - 1 });
        inputRefs.current[`${row}_${col - 1}`]?.focus();
      } else if (direction === 'vertical' && row > 0 && solution.isWhite[row - 1][col]) {
        setActiveCell({ row: row - 1, col });
        inputRefs.current[`${row - 1}_${col}`]?.focus();
      }
    } else if (e.key === 'ArrowRight' && col + 1 < GRID_SIZE && solution.isWhite[row][col + 1]) {
      e.preventDefault();
      setActiveCell({ row, col: col + 1 });
      inputRefs.current[`${row}_${col + 1}`]?.focus();
    } else if (e.key === 'ArrowLeft' && col - 1 >= 0 && solution.isWhite[row][col - 1]) {
      e.preventDefault();
      setActiveCell({ row, col: col - 1 });
      inputRefs.current[`${row}_${col - 1}`]?.focus();
    } else if (e.key === 'ArrowDown' && row + 1 < GRID_SIZE && solution.isWhite[row + 1][col]) {
      e.preventDefault();
      setActiveCell({ row: row + 1, col });
      inputRefs.current[`${row + 1}_${col}`]?.focus();
    } else if (e.key === 'ArrowUp' && row - 1 >= 0 && solution.isWhite[row - 1][col]) {
      e.preventDefault();
      setActiveCell({ row: row - 1, col });
      inputRefs.current[`${row - 1}_${col}`]?.focus();
    }
  };

  const toggleDirection = () => setDirection(dir => dir === 'horizontal' ? 'vertical' : 'horizontal');
  
  const resetGame = () => {
    setGrid(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill('')));
    setActiveCell({ row: 0, col: 0 });
    setDirection('horizontal');
    setCompleted(false);
    setModalInfo({ show: false, message: '' });
    inputRefs.current[`0_0`]?.focus();
  };

  const checkSolution = () => {
    const isCorrect = grid.every((rowArr, r) =>
      rowArr.every((cell, c) => !solution.isWhite[r][c] || (cell && cell.toUpperCase() === solution.sol[r][c].toUpperCase()))
    );

    if (isCorrect) {
      setCompleted(true);
      setModalInfo({
        show: true,
        message: 'Parabéns! Você completou a cruzadinha corretamente e ganhou um vale beijo! 💕',
      });
    } else {
      setModalInfo({
        show: true,
        message: 'Ainda não está correto. Tente novamente! 💜',
      });
    }
  };

  if (!solution) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={{ ...styles.container, backgroundColor: colors.background }}>
      <h1 style={{ ...styles.heading, color: colors.primary }}>Te Vivo</h1>

      <div style={styles.contentWrapper}>
        <div className="grid-container" style={{ borderColor: colors.primary, backgroundColor: colors.light }}>
          {grid.map((row, r) => (
            <div key={r} style={styles.gridRow}>
              {row.map((cell, c) => (
                <div
                  key={c}
                  className="grid-cell"
                  style={{
                    borderColor: colors.grid,
                    backgroundColor: solution.isWhite[r][c] ?
                      (r === activeCell.row && c === activeCell.col ? colors.accent : cell ? colors.highlight : 'white') :
                      colors.black,
                    cursor: solution.isWhite[r][c] ? 'pointer' : 'default',
                  }}
                  onClick={() => handleCellClick(r, c)}
                >
                  {solution.isWhite[r][c] && (
                    <>
                      {solution.numbered[`${r}_${c}`] && (
                        <span className="cell-number" style={{ color: colors.text }}>
                          {solution.numbered[`${r}_${c}`]}
                        </span>
                      )}
                      <input
                        ref={el => inputRefs.current[`${r}_${c}`] = el}
                        value={cell}
                        onChange={(e) => handleInputChange(r, c, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, r, c)}
                        className="cell-input"
                        style={{ color: colors.text }}
                        maxLength={1}
                        tabIndex={solution.isWhite[r][c] ? 0 : -1}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="controls-panel" style={{ backgroundColor: colors.secondary }}>
          <button onClick={toggleDirection} style={{ ...styles.button, backgroundColor: colors.primary, color: 'white' }}>
            Direção: {direction === 'horizontal' ? '→ Horizontal' : '↓ Vertical'}
          </button>
          <button onClick={resetGame} style={{ ...styles.button, backgroundColor: colors.accent, color: colors.text }}>
            Reiniciar
          </button>
          {!completed && (
            <button onClick={checkSolution} style={{ ...styles.button, backgroundColor: colors.accent, color: colors.text }}>
              Verificar Respostas
            </button>
          )}

          {completed && <div style={styles.completionMessage}>Parabéns! Completado! 💜</div>}

          {showClues && (
            <div>
              <h3 style={{ ...styles.subHeading, color: colors.primary }}>Pistas Horizontais</h3>
              {words.horizontal.map((item) => (
                <div key={item.number} style={styles.clueItem}>
                  <strong>{item.number}:</strong> {item.clue}
                </div>
              ))}
              <h3 style={{ ...styles.subHeading, color: colors.primary }}>Pistas Verticais</h3>
              {words.vertical.map((item) => (
                <div key={item.number} style={styles.clueItem}>
                  <strong>{item.number}:</strong> {item.clue}
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setShowClues(!showClues)} style={{ ...styles.toggleButton, backgroundColor: colors.primary, color: 'white' }}>
            {showClues ? 'Esconder Pistas' : 'Mostrar Pistas'}
          </button>
        </div>
      </div>

      <p style={{ ...styles.footerText, color: colors.text }}>
        Clique nas células para focar, digite letras (incluindo acentos). Use setas para navegar ou Tab. Divirta-se! 💕
      </p>

      {modalInfo.show && (
        <ResultModal
          message={modalInfo.message}
          onClose={() => setModalInfo({ show: false, message: '' })}
        />
      )}

      <style>
        {`
          :root {
            --grid-size: 19;
            --cell-size: calc((100vmin - 100px) / var(--grid-size));
          }
          
          @media (min-width: 768px) {
            :root {
              --cell-size: 30px;
            }
          }
          
          .grid-container {
            border: 2px solid;
            border-radius: 10px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            width: fit-content;
            height: fit-content;
          }
          
          .grid-cell {
            width: var(--cell-size);
            height: var(--cell-size);
            border: 1px solid;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: calc(var(--cell-size) * 0.6);
            font-weight: bold;
            margin: 1px;
            position: relative;
          }
          
          .cell-number {
            position: absolute;
            top: 2px;
            left: 2px;
            font-size: calc(var(--cell-size) * 0.3);
          }
          
          .cell-input {
            width: 100%;
            height: 100%;
            border: none;
            background: transparent;
            text-align: center;
            font-size: calc(var(--cell-size) * 0.6);
            font-weight: bold;
            outline: none;
          }

          .controls-panel {
            min-width: 250px;
            max-height: 500px;
            overflow-y: auto;
            padding: 20px;
            border-radius: 10px;
          }

          @media (max-width: 767px) {
            .controls-panel {
              min-width: 100%;
              max-height: none;
              margin-top: 20px;
            }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
  },
  contentWrapper: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap',
  },
  gridRow: {
    display: 'flex',
  },
  button: {
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px',
    width: '100%',
  },
  completionMessage: {
    color: 'green',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subHeading: {
    marginTop: 0,
  },
  clueItem: {
    marginBottom: '10px',
  },
  toggleButton: {
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
  },
  footerText: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
  },
};

const modalStyles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '80%',
    minWidth: '250px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
  },
  message: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.primary,
  },
  button: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: colors.primary,
    color: 'white',
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default CrosswordGame;