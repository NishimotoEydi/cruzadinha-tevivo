import { useState } from 'react';

export const words = {
  horizontal: [
    { word: 'AMORINHA', clue: '“Apelido que nasceu no Stop.”', row: 0, col: 2, number: 1 },
    { word: 'TIA', clue: '“Como meu priminho bebê te chamou e você amou.”', row: 0, col: 11, number: 2 },
    { word: 'BIS', clue: '“O chocolate que ficou tanto tempo guardado que venceu.”', row: 1, col: 0, number: 4 },
    { word: 'MAIO', clue: '“O mês que tudo começou.”', row: 2, col: 4, number: 5 },
    { word: 'TRINTAEUM', clue: '“Dia do nosso primeiro date.”', row: 3, col: 9, number: 6 },
    { word: 'JULHO', clue: '“O mês do nosso sim.”', row: 5, col: 7, number: 7 },
    { word: 'SÃOPAULO', clue: '“A viagem marcada para outubro que estamos ansiosos.”', row: 6, col: 0, number: 9 },
    { word: 'VINTESEIS', clue: '“Dia em que pedi você em namoro.”', row: 8, col: 5, number: 12 },
    { word: 'JORGINHO', clue: '“Nosso filhinho de pelúcia.”', row: 12, col: 0, number: 16 },
    { word: 'RAPAIZINHA', clue: '“Como te chamo quando finjo discutir.”', row: 13, col: 9, number: 17 },
    { word: 'ABELINHAS', clue: '“Produziram o LipHoney do pedido.”', row: 15, col: 9, number: 18 },
    { word: 'PIPOCA', clue: '“Sobrou do cinema e durou quase uma semana.”', row: 17, col: 11, number: 19 },
  ],
  vertical: [
    { word: 'ASSENTO', clue: '“O lugar em comum no curso que nos uniu.”', row: 0, col: 2, number: 1 },
    { word: 'TEVIVO', clue: '“Mais que um te amo, o que sinto por você.”', row: 0, col: 11, number: 2 },
    { word: 'CINEMA', clue: '“Nosso primeiro encontro.”', row: 0, col: 15, number: 3 },
    { word: 'MILKA', clue: '“Chocolate branco do Dia dos Namorados.”', row: 2, col: 4, number: 5 },
    { word: 'JOHNNYJOY', clue: '“O primeiro milk shake recheado dela.”', row: 5, col: 7, number: 7 },
    { word: 'TORTELETA', clue: '“O doce de limão que apresentei e você adorou.”', row: 5, col: 18, number: 8 },
    { word: 'SUSHI', clue: '“Comida do primeiro restaurante em que comemos juntos.”', row: 6, col: 0, number: 9 },
    { word: 'PRINCESA', clue: '“Primeira casa do tabuleiro no dia do pedido.”', row: 6, col: 12, number: 10 },
    { word: 'SENAC', clue: '“Nome do lugar onde tudo começou de fato.”', row: 7, col: 9, number: 11 },
    { word: 'LACREME', clue: '“Primeiro presente que te dei.”', row: 9, col: 2, number: 13 },
    { word: 'ENCANTADA', clue: '“Minha princesa...”', row: 9, col: 16, number: 14 },
    { word: 'UNIBE', clue: '“O cursinho que eu sempre brinquei contigo.”', row: 11, col: 5, number: 15 },
  ]
};

export const GRID_SIZE = 19;

export const useCrosswordGrid = () => {
  const [solution, setSolution] = useState(null);

  useState(() => {
    const sol = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(''));
    const isWhite = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
    const numbered = {};
    let numberCounter = 1;

    words.horizontal.forEach(({ word, row, col, number }) => {
      for (let i = 0; i < word.length; i++) {
        const r = row;
        const c = col + i;
        if (r < GRID_SIZE && c < GRID_SIZE) {
          sol[r][c] = word[i];
          isWhite[r][c] = true;
          if (i === 0) {
            numbered[`${r}_${c}`] = number || numberCounter++;
          }
        }
      }
    });

    words.vertical.forEach(({ word, row, col, number }) => {
      for (let i = 0; i < word.length; i++) {
        const r = row + i;
        const c = col;
        if (r < GRID_SIZE && c < GRID_SIZE) {
          sol[r][c] = word[i];
          isWhite[r][c] = true;
          if (i === 0) {
            numbered[`${r}_${c}`] = number || numberCounter++;
          }
        }
      }
    });

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!isWhite[r][c]) {
          sol[r][c] = '';
        }
      }
    }

    setSolution({ sol, isWhite, numbered });
  });

  return solution;
};