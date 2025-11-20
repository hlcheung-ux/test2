import { CellData } from '../types';

const GRID_SIZE = 8;
const CENTER_ROW = 3; // 0-indexed, visually near center
const CENTER_COL = 3;

interface Coordinate {
  row: number;
  col: number;
}

// Helper to get valid neighbors (including diagonals)
const getNeighbors = (row: number, col: number): Coordinate[] => {
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];
  
  const neighbors: Coordinate[] = [];
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    
    if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }
  
  return neighbors;
};

// Shuffle array helper
const shuffle = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Backtracking algorithm to find a path for the sentence
const findPath = (
  currentLength: number,
  targetLength: number,
  currentPos: Coordinate,
  visited: Set<string>
): Coordinate[] | null => {
  if (currentLength === targetLength) {
    return [currentPos];
  }

  const neighbors = shuffle(getNeighbors(currentPos.row, currentPos.col));
  
  for (const nextPos of neighbors) {
    const posKey = `${nextPos.row},${nextPos.col}`;
    if (!visited.has(posKey)) {
      visited.add(posKey);
      const restOfPath = findPath(currentLength + 1, targetLength, nextPos, visited);
      if (restOfPath) {
        return [currentPos, ...restOfPath];
      }
      visited.delete(posKey);
    }
  }

  return null;
};

export const generateGrid = (sentence: string, allPoemChars: string): CellData[] => {
  // Sentence includes the start char (which was the end of previous)
  // e.g., Prev: "ABC", Next: "CDE". Sentence passed here is "CDE". 
  // BUT visual logic: center is 'C'.
  
  const pathLength = sentence.length;
  const startPos = { row: CENTER_ROW, col: CENTER_COL };
  const visited = new Set<string>();
  visited.add(`${startPos.row},${startPos.col}`);
  
  // Attempt to find a path. Retry if randomization leads to dead end early (rare on 8x8 with len 20)
  let path: Coordinate[] | null = null;
  let attempts = 0;
  
  while (!path && attempts < 50) {
    visited.clear();
    visited.add(`${startPos.row},${startPos.col}`);
    path = findPath(1, pathLength, startPos, visited);
    attempts++;
  }

  if (!path) {
    // Fallback: extremely unlikely, but just fill linear if fails
    console.error("Failed to generate path");
    path = []; 
    // Emergency fallback path logic could go here, but 8x8 is huge for length 20.
  }

  const cells: CellData[] = [];
  const pathSet = new Set<string>();
  
  // Map path coordinates to sentence characters
  path.forEach((coord, index) => {
    const key = `${coord.row},${coord.col}`;
    pathSet.add(key);
    cells.push({
      id: key,
      row: coord.row,
      col: coord.col,
      char: sentence[index],
      isPath: true,
      sequenceIndex: index
    });
  });

  // Fill remaining cells
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const key = `${r},${c}`;
      if (!pathSet.has(key)) {
        // Pick a random char from the whole poem to be a distractor
        const randomChar = allPoemChars[Math.floor(Math.random() * allPoemChars.length)];
        cells.push({
          id: key,
          row: r,
          col: c,
          char: randomChar,
          isPath: false,
          sequenceIndex: -1
        });
      }
    }
  }

  return cells;
};
