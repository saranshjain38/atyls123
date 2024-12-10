import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [inputValue, setInputValue] = useState(2);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [outputValue, setOutputValue] = useState(null);

  const functionDetails = [
    { id: 1, equation: (x) => x ** 2, next: 2, top: 100, left: 200 },
    { id: 2, equation: (x) => 2 * x + 4, next: 4, top: 100, left: 400 },
    { id: 4, equation: (x) => x - 2, next: 5, top: 300, left: 300 },
    { id: 5, equation: (x) => x / 2, next: 3, top: 500, left: 400 },
    { id: 3, equation: (x) => x ** 2 + 20, next: null, top: 100, left: 600 },
  ];
  useEffect(() => {
    drawConnections();
    window.addEventListener("resize", drawConnections);

    return () => window.removeEventListener("resize", drawConnections);
  }, []);

  const calculate = () => {
    let currentValue = inputValue;
    let currentFunction = 1;

    while (currentFunction !== null) {
      const func = functionDetails.find((f) => f.id === currentFunction);
      if (!func) break;

      currentValue = func.equation(currentValue);
      currentFunction = func.next;
    }

    setOutputValue(currentValue);
  };

  const drawConnections = () => {
    const svg = svgRef.current;
    svg.innerHTML = ""; // Clear existing lines

    functionDetails.forEach((func) => {
      if (func.next) {
        const fromBox = document.getElementById(`function-${func.id}`);
        const toBox = document.getElementById(`function-${func.next}`);

        if (fromBox && toBox) {
          const fromOutput = fromBox.querySelector(".output");
          const toInput = toBox.querySelector(".input");

          const fromRect = fromOutput.getBoundingClientRect();
          const toRect = toInput.getBoundingClientRect();

          const svgRect = svg.getBoundingClientRect();

          const x1 = fromRect.x + fromRect.width / 2 - svgRect.x;
          const y1 = fromRect.y + fromRect.height / 2 - svgRect.y;
          const x2 = toRect.x + toRect.width / 2 - svgRect.x;
          const y2 = toRect.y + toRect.height / 2 - svgRect.y;

          drawLine(x1, y1, x2, y2, svg);
        }
      }
    });
  };

  const drawLine = (x1, y1, x2, y2, svg) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "blue");
    line.setAttribute("stroke-width", "2");
    svg.appendChild(line);
  };

  return (
    <div ref={containerRef} className="container">
      <svg ref={svgRef} className="svg-overlay"></svg>
      <div className="node initial">
        <span>Initial value of x</span>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
        />
      </div>
      {functionDetails.map((func) => (
        <div
          id={`function-${func.id}`}
          className="function-box"
          style={{ top: func.top, left: func.left }}
          key={func.id}
        >
          <div className="header">Function {func.id}</div>
          <div className="content">
            <div>Equation: {func.equation}</div>
            <div>Next Function: {func.next || "None"}</div>
          </div>
          <div className="ports">
            <div className="input">input</div>
            <div className="output">output</div>
          </div>
        </div>
      ))}
      <div className="node final">
        <span>Final Output y</span>
        <div className="output-box">
          {outputValue !== null ? outputValue : "?"}
        </div>
      </div>

      <button className="calculate-btn" onClick={calculate}>
        Calculate
      </button>
    </div>
  );
};

export default App;
