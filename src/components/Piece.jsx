import React, { useState } from "react";
import B_Bishop from "../assets/b_bishop.svg";
import B_Pawn from "../assets/b_pawn.svg";
import B_King from "../assets/b_king.svg";
import B_Queen from "../assets/b_queen.svg";
import B_Knight from "../assets/b_knight.svg";
import B_Rook from "../assets/b_rook.svg";
import W_Bishop from "../assets/w_bishop.svg";
import W_King from "../assets/w_king.svg";
import W_Queen from "../assets/w_queen.svg";
import W_Knight from "../assets/w_knight.svg";
import W_Rook from "../assets/w_rook.svg";
import W_Pawn from "../assets/w_pawn.svg";

export default function Piece({ pieceType }) {
  const typeToImage = () => {
    switch (pieceType) {
      case "p":
        return B_Pawn;
      case "P":
        return W_Pawn;
      case "n":
        return B_Knight;
      case "N":
        return W_Knight;
      case "k":
        return B_King;
      case "K":
        return W_King;
      case "q":
        return B_Queen;
      case "Q":
        return W_Queen;
      case "b":
        return B_Bishop;
      case "B":
        return W_Bishop;
      case "r":
        return B_Rook;
      case "R":
        return W_Rook;
      default:
        return undefined;
    }
  };
  return <img alt={pieceType} src={typeToImage(pieceType)} />;
}
