import { letters } from "../../constants";
import { isNumeric, reverse } from "../../utils";
import { regex } from "../regex";
import {
  getActualPlayer,
  getCastlings,
  getFullMoveCounter,
  getPiecePositionFEN,
  getRow,
} from "./fenGetters";

export const contractFEN = (fen) => {
  return fen.map((row) => {
    let new_row = "";
    let counter = 0;
    row.split("").forEach((elem) => {
      if (elem === "1") {
        counter++;
      } else if (counter !== 0 && elem !== "1") {
        new_row += counter + elem;
        counter = 0;
      } else {
        new_row += elem;
      }
    });
    if (counter !== 0) new_row += counter;
    return new_row;
  });
};

export const replaceElemInRow = (row, x, replacement = "1") => {
  row = row.split("");
  row[letters.indexOf(x)] = replacement;
  return row.join("");
};
export const replaceRowInFEN = (fen, row, rowIndex) => {
  if (rowIndex <= 0 && rowIndex > 8) {
    return false;
  }
  fen = reverse(fen);
  fen[rowIndex - 1] = row;
  return reverse(fen);
};

export const expandFEN = (fen) => {
  const positions = getPiecePositionFEN(fen);
  let new_positions = [];
  positions.forEach((elements) => {
    let temp = "";
    elements.split("").forEach((element) => {
      if (isNumeric(element)) {
        for (let i = 0; i < element; i++) {
          temp += "1";
        }
      } else {
        temp += element;
      }
    });
    new_positions.push(temp);
  });
  return new_positions;
};
export const toggle_player = (fen) => {
  if (getActualPlayer(fen) === "w") return "b";
  else return "w";
};

export const movePiece = (fen, piece, destination) => {
  let next_player = toggle_player(fen);
  let expanded_fen = expandFEN(fen);
  let move = `${piece.x}${piece.y}${destination.x}${destination.y}`;

  let castlings = getCastlings(fen);
  let enPasant = "-";

  // check castling
  if (move.match(regex.castlingMove)) {
    switch (move) {
      case "e1g1":
      case "e1c1":
        castlings.replace(/[kq]+/, "-");
        break;
      case "e8g8":
      case "e1c8":
        castlings.replace(/[KQ]+/, "- ");
        break;
      default:
        break;
    }
  }
  if (move.match(regex.pawnDoubleMove)) {
    if (piece.owner === "w") {
      enPasant = `${piece.x}${destination.y - 1}`;
    } else {
      enPasant = `${piece.x}${destination.y + 1}`;
    }
  }

  // coords
  const xOrigin = piece.x;
  const yOrigin = piece.y;
  const xDest = destination.x;
  const yDest = destination.y;

  // datas
  const actualPlayer = getActualPlayer(fen);
  // horizontal move
  if (yOrigin === yDest) {
    let row = getRow(expanded_fen, yOrigin);
    row = replaceElemInRow(row, xOrigin);
    row = replaceElemInRow(row, xDest, piece.name);
    expanded_fen = replaceRowInFEN(expanded_fen, row, yOrigin);
  } else {
    //fetch rows
    let originRow = getRow(expanded_fen, yOrigin);
    let destRow = getRow(expanded_fen, yDest);
    //transform rows
    originRow = replaceElemInRow(originRow, xOrigin);
    destRow = replaceElemInRow(destRow, xDest, piece.name);

    // update fen
    expanded_fen = replaceRowInFEN(expanded_fen, originRow, yOrigin);
    expanded_fen = replaceRowInFEN(expanded_fen, destRow, yDest);
  }

  // standardize fen
  let contracted_fen = contractFEN(expanded_fen).join("/");
  if (contracted_fen.match(regex.fenString)) {
  }
  return (
    contracted_fen +
    ` ${next_player} ${"KQkq"} ${enPasant} ${"0"} ${
      actualPlayer === "b"
        ? +getFullMoveCounter(fen) + 1
        : getFullMoveCounter(fen)
    }`
  );
};

export const capturePiece = (fen, selectedPiece, { x, y }) => {
  console.log(`${selectedPiece.x}${selectedPiece.y}x${x}${y}`);
  return fen;
};
