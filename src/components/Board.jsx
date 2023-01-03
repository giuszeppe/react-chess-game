import React, { useCallback, useEffect, useState } from "react";
import { subscribe, unsubscribe } from "../events";
import BoardRenderer from "./BoardRenderer";

import { calculatePossibleMoves, isLegal } from "./pieces/pieces";
import { expandFEN, movePiece } from "./fen/fenManipulators";

import { getActualPlayer, getPieceFromCoords } from "./fen/fenGetters";

export default function Board() {
  // helper function

  const [selectedPiece, setSelectedPiece] = useState(null);
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );

  // Event Handling
  const handleMove = useCallback(
    (e) => {
      // Transforming FEN
      const piece = getPieceFromCoords(fen, e.detail.coords);
      const intendedMove = `${e.detail.coords.x}${e.detail.coords.y}`;

      if (piece && getActualPlayer(fen) === piece.owner) {
        piece.available_moves = calculatePossibleMoves(fen, piece);
        setSelectedPiece(piece);
      }
      if (!isLegal([], intendedMove)) {
        //return null;
      }
      if (
        piece == null &&
        selectedPiece &&
        selectedPiece.available_moves.includes(intendedMove)
      ) {
        const updatedFEN = movePiece(fen, selectedPiece, e.detail.coords);
        setFen(updatedFEN);
        setSelectedPiece(null);
      }
      if (
        piece &&
        piece.owner !== getActualPlayer(fen) &&
        selectedPiece &&
        selectedPiece.available_moves.includes(intendedMove)
      ) {
        const updatedFEN = movePiece(fen, selectedPiece, e.detail.coords);
        setFen(updatedFEN);
        setSelectedPiece(null);
        //capturePiece(selectedPiece, e.detail.coords);
      }
    },
    [fen, selectedPiece]
  );

  useEffect(() => {
    subscribe("move", handleMove);
    return () => {
      unsubscribe("move", handleMove);
    };
  }, [handleMove]);

  return (
    <div className="main-board">
      <h1>It's {getActualPlayer(fen) === "w" ? "White's" : "Black's"} turn</h1>
      <BoardRenderer fen={expandFEN(fen)} turn={getActualPlayer(fen)} />
      <div>{fen}</div>
      {/*numbers.map((n) => {
        color = !color;
        let temp = color;
        const results = letters.map((l) => {
          temp = !temp;
          return (
            <Cell
              key={n + l}
              board={board}
              color={temp}
              row={n}
              column={l}
              piece={null}
            />
          );
        });
        return results;
      })*/}
    </div>
  );
}
