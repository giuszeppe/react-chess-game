import React, { useState } from "react";
import { publish } from "../events";

export default function Cell({ color, children, l, n }) {
  const [x, setX] = useState(l);
  const [y, setY] = useState(n);
  return (
    <div
      className={`cell ${color ? "cell-black" : "cell-white"}`}
      onClick={() => publish("move", { coords: { x: x, y: y } })}
    >
      {children}
    </div>
  );
}
