import React, { useState } from "react";
import Cell from "./Cell";
import Piece from "./Piece";
import { isNumeric } from "../utils";

const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
const numbers = [1, 2, 3, 4, 5, 6, 7, 8].reverse();

export default function BoardRenderer({ fen }) {
  const rows = fen;

  let color = true;
  const boaaaard = rows.map((row, i) => {
    color = !color;
    let temp = color;
    return (
      <div key={crypto.randomUUID()} className="row">
        {row.split("").map((cell, j) => {
          temp = !temp;
          // if is necessary to skip some spaces
          /*
          if (isNumeric(cell)) {
            let cells = [];
            for (let k = 0; k < cell; k++) {
              cells.push(
                <Cell
                  key={crypto.randomUUID()}
                  l={letters[j]}
                  n={numbers[i]}
                  color={temp}
                />
              );
              if (cell !== "1") temp = !temp;
            }
            if (cell !== "1") {
              temp = !temp;
            }
            return <>{cells}</>;
          }
          /
*/
          return (
            <Cell
              l={letters[j]}
              n={numbers[i]}
              key={crypto.randomUUID()}
              color={temp}
            >
              {isNumeric(cell) ? (
                <div />
              ) : (
                <Piece
                  key={letters[j] + numbers[i]}
                  l={letters[j]}
                  n={numbers[i]}
                  pieceType={cell}
                />
              )}
            </Cell>
          );
        })}
      </div>
    );
  });
  return <div>{boaaaard}</div>;
}
