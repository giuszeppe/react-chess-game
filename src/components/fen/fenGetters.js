import { letters } from "../../constants";
import { reverse } from "../../utils";
import { expandFEN } from "./fenManipulators";

export const getPiecePositionFEN = (fen) => {
  return fen.split(" ")[0].split("/");
};
export const getActualPlayer = (fen) => {
  // string
  return fen.split(" ")[1];
};

export const getCastlings = (fen) => {
  return fen.split(" ")[2];
};

export const getFullMoveCounter = (fen) => {
  return fen.split(" ")[5];
};

export const getHalfmoveCounter = (fen) => {
  return fen.split(" ")[4];
};

export const getRow = (fen, n) => {
  //array
  if (n <= 0 && n > 8) {
    return false;
  }
  return reverse(fen)[n - 1];
};
export const getElemInRow = (row, x) => {
  if (x === undefined) {
    return "1";
  }
  // string
  return row.split("")[letters.indexOf(x)];
};
export const getPieceFromCoords = (fen, { x, y }) => {
  // string
  const expanded_fen = expandFEN(fen);
  const row = getRow(expanded_fen, y);
  const piece = getElemInRow(row, x);
  return piece === "1"
    ? null
    : {
        name: piece,
        owner: piece === piece.toUpperCase() ? "w" : "b",
        x,
        y,
      };
};
