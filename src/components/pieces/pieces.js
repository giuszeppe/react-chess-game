import { getActualPlayer, getPieceFromCoords } from "../fen/fenGetters";

export const calculatePossibleMoves = (fen, piece) => {
  let x = piece.x;
  let y = piece.y;
  let pieceType = piece.name;
  let owner = piece.owner;
  switch (pieceType.toUpperCase()) {
    case "P":
      return pawnMoves(fen, x, y, owner);
    case "K":
      return kingMoves(fen, x, y, owner);
    case "R":
      return rookMoves(fen, x, y);
    case "B":
      return bishopMoves(fen, x, y);
    case "Q":
      return queenMoves(fen, x, y);
    case "N":
      return knightMoves(fen, x, y);
    default:
      return [];
  }
};
export const isLegal = (board, intendedMove) => {
  return false;
};
let letters = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const pawnMoves = (fen, x, y, owner) => {
  const moves = [];
  let augment = owner === "w" ? 1 : -1;
  // up 1 square
  if (getPieceFromCoords(fen, { x, y: +y + augment }) === null) {
    moves.push(`${x}${+y + augment}`);
  }

  // up 2 squares
  if ((owner === "w" && y === 2) || (owner === "b" && y === 7)) {
    moves.push(`${x}${+y + augment * 2}`);
  }

  // captures
  const leftDiagonalCoords = {
    x: letters[letters.indexOf(x) - 1],
    y: +y + augment,
  };
  const rightDiagonalCoords = {
    x: letters[letters.indexOf(x) - 1],
    y: +y + augment,
  };

  const leftDiagonalPiece = getPieceFromCoords(fen, leftDiagonalCoords);
  const rightDiagonalPiece = getPieceFromCoords(fen, rightDiagonalCoords);

  if (leftDiagonalPiece && leftDiagonalPiece.owner !== getActualPlayer(fen)) {
    moves.push(`${letters[letters.indexOf(x) - 1]}${+y + augment}`);
  }
  if (rightDiagonalPiece && rightDiagonalPiece.owner !== getActualPlayer(fen)) {
    moves.push(`${letters[letters.indexOf(x) + 1]}${+y + augment}`);
  }
  return moves;
};
export const kingMoves = (fen, x, y, owner) => {
  const moves = [];
  const coordsArray = [
    { x, y: +y + 1 },
    { x, y: y - 1 },
    { x: letters[letters.indexOf(x) + 1], y },
    { x: letters[letters.indexOf(x) - 1], y },
    { x: letters[letters.indexOf(x) - 1], y: +y + 1 },
    { x: letters[letters.indexOf(x) - 1], y: +y - 1 },
    { x: letters[letters.indexOf(x) + 1], y: +y + 1 },
    { x: letters[letters.indexOf(x) + 1], y: +y - 1 },
  ];
  for (const coords of coordsArray) {
    if (!coordsAreValid(coords)) {
      continue;
    }
    let piece = getPieceFromCoords(fen, coords);
    if (piece && piece.owner === getActualPlayer(fen)) {
      continue;
    }
    moves.push(`${coords.x}${coords.y}`);
  }

  return moves;
};
export const rookMoves = (fen, x, y) => {
  let hmoves = [];
  let vmoves = [];
  const moves = [];
  let hrecording = true;
  let vrecording = true;
  let finalVStop = false;
  let finalHStop = false;
  for (let i = 0; i < 8; i++) {
    let vcell = i + 1;
    let pieceV = getPieceFromCoords(fen, { x, y: vcell });
    let pieceH = getPieceFromCoords(fen, { x: letters[i], y });
    vrecording = pieceV === null && !finalVStop;
    hrecording = pieceH === null && !finalHStop;
    //VERTICAL MOVEMENT
    // if cell is free, then add to possible moves
    if (!finalVStop) {
      if (vcell < y && pieceV && pieceV.owner !== getActualPlayer(fen)) {
        vmoves.push(`${x}${vcell}`);
      } else if (vcell !== y && vrecording) {
        vmoves.push(`${x}${vcell}`);
        if (vcell === 8) {
          moves.push(...vmoves);
          vmoves = [];
          finalVStop = true;
        }
        //if cell is not free, you cannot move here
      } else if (!vrecording && vcell < y) {
        vmoves = [];
      } else if (vcell === y) {
        moves.push(...vmoves);
        vmoves = [];
      } else if (!vrecording && vcell > y) {
        if (pieceV && pieceV.owner !== getActualPlayer(fen))
          moves.push(`${x}${vcell}`);
        moves.push(...vmoves);
        vmoves = [];
        finalVStop = true;
      }
    }
    // HORIZONTAL MOVEMENT
    let xIndex = letters.indexOf(x);

    if (!finalHStop) {
      if (i < xIndex && pieceH && pieceH.owner !== getActualPlayer(fen)) {
        hmoves.push(`${letters[i]}${y}`);
      } else if (i !== xIndex && hrecording) {
        hmoves.push(`${letters[i]}${y}`);
        if (i === 7) {
          moves.push(...hmoves);
          hmoves = [];
          finalHStop = true;
        }
        //if cell is not free, you cannot move here
      } else if (!hrecording && i < xIndex) {
        hmoves = [];
      } else if (i === xIndex) {
        moves.push(...hmoves);
        hmoves = [];
      } else if (!hrecording && i > xIndex) {
        if (pieceH && pieceH.owner !== getActualPlayer(fen))
          moves.push(`${letters[i]}${y}`);
        moves.push(...hmoves);
        hmoves = [];
        finalHStop = true;
      }
    }
  }
  console.log(moves);
  return moves;
};
function coordsAreValid(coords) {
  if (letters.includes(coords.x) && coords.y > 0 && coords.y <= 8) {
    return true;
  }
  return false;
}

export const bishopMoves = (fen, x, y) => {
  const moves = [];
  let i = letters.indexOf(x) + 1;
  while (i <= 8) {
    i++;
    let diff = i - letters.indexOf(x) - 1;
    let coords = { x: letters[i - 1], y: +y + diff };
    if (!coordsAreValid(coords)) {
      i++;
      continue;
    }
    let piece = getPieceFromCoords(fen, coords);
    if (piece == null) {
      moves.push(`${letters[i - 1]}${+y + diff}`);
    } else if (piece && piece.owner !== getActualPlayer(fen)) {
      moves.push(`${letters[i - 1]}${+y + diff}`);
      break;
    } else {
      break;
    }
  }
  i = letters.indexOf(x) + 1;
  while (i <= 8) {
    i++;
    let diff = i - letters.indexOf(x) - 1;
    let coords = { x: letters[i - 1], y: +y - diff };
    if (!coordsAreValid(coords)) {
      i++;
      continue;
    }
    let piece = getPieceFromCoords(fen, coords);
    if (piece == null) {
      moves.push(`${letters[i - 1]}${+y - diff}`);
    } else if (piece && piece.owner !== getActualPlayer(fen)) {
      moves.push(`${letters[i - 1]}${+y - diff}`);
      break;
    } else {
      break;
    }
  }
  i = letters.indexOf(x) + 1;
  while (i > 0) {
    i--;
    let diff = i - letters.indexOf(x) - 1;
    let coords = { x: letters[i - 1], y: +y + diff };
    if (!coordsAreValid(coords)) {
      i--;
      continue;
    }
    let piece = getPieceFromCoords(fen, coords);
    if (piece == null) {
      moves.push(`${letters[i - 1]}${+y + diff}`);
    } else if (piece && piece.owner !== getActualPlayer(fen)) {
      moves.push(`${letters[i - 1]}${+y + diff}`);
      break;
    } else {
      break;
    }
  }
  i = letters.indexOf(x) + 1;
  while (i > 0) {
    i--;
    let diff = i - letters.indexOf(x) - 1;
    let coords = { x: letters[i - 1], y: +y - diff };
    if (!coordsAreValid(coords)) {
      i--;
      continue;
    }
    let piece = getPieceFromCoords(fen, coords);
    if (piece == null) {
      moves.push(`${letters[i - 1]}${+y - diff}`);
    } else if (piece && piece.owner !== getActualPlayer(fen)) {
      moves.push(`${letters[i - 1]}${+y - diff}`);
      break;
    } else {
      break;
    }
  }
  console.log(moves);
  return moves;
};
export const queenMoves = (fen, x, y) => {
  return [...bishopMoves(fen, x, y), ...rookMoves(fen, x, y)];
};

export const knightMoves = (fen, x, y) => {
  const moves = [];
  const coordsArray = [
    { x: letters[letters.indexOf(x) + 1], y: y + 2 },
    { x: letters[letters.indexOf(x) - 1], y: y + 2 },
    { x: letters[letters.indexOf(x) + 1], y: y - 2 },
    { x: letters[letters.indexOf(x) - 1], y: y - 2 },
    { x: letters[letters.indexOf(x) + 2], y: y + 1 },
    { x: letters[letters.indexOf(x) - 2], y: y + 1 },
    { x: letters[letters.indexOf(x) + 2], y: y - 1 },
    { x: letters[letters.indexOf(x) - 2], y: y - 1 },
  ];
  for (let coords of coordsArray) {
    if (!coordsAreValid(coords)) {
      continue;
    }
    let piece = getPieceFromCoords(fen, coords);
    if (piece && piece.owner === getActualPlayer(fen)) {
      continue;
    }
    moves.push(`${coords.x}${coords.y}`);
  }
  return moves;
};
