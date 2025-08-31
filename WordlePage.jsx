import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Button from "@mui/material/Button";

export const WordlePage = () => {
  const [gameOver, setGameOver] = useState(false);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [grid, setGrid] = useState(
    Array(6)
      .fill()
      .map(() => Array(5).fill(""))
  );
  const [gameStarted, setGameStarted] = useState(false);
  const [cellColors, setCellColors] = useState(
    Array(6)
      .fill()
      .map(() => Array(5).fill("white"))
  );

  useEffect(() => {
    fetch("http://localhost:3001/start")
      .then((res) => res.json())
      .then(() => setGameStarted(true));
  }, []);

  useEffect(() => {
    const handleKeyDown = async (event) => {
      const key = event.key;
      if (gameOver) return;

      if (/^[a-zA-Z]$/.test(key) && currentCol < 5) {
        const newGrid = [...grid];
        newGrid[currentRow][currentCol] = key.toUpperCase();
        setGrid(newGrid);
        setCurrentCol(currentCol + 1);
      } else if (key === "Backspace") {
        if (currentCol > 0) {
          const newGrid = [...grid];
          newGrid[currentRow][currentCol - 1] = "";
          setGrid(newGrid);
          setCurrentCol(currentCol - 1);
        }
      } else if (key === "Enter" && currentCol === 5) {
        // Get the guess from the current row
        const guess = grid[currentRow].join("").toLowerCase();

        try {
          const helper = await fetch("http://localhost:3001/valid", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentGuess: guess }),
          });
          const data_two = await helper.json();

          if (data_two.result === "true") {
            const res = await fetch("http://localhost:3001/guess", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ currentGuess: guess }),
            });
            const data = await res.json();

            const newCellColors = cellColors.map((row) => [...row]);

            for (var i = 0; i < 5; i++) {
              if (data.result[i] == "Y") {
                newCellColors[currentRow][i] = "green";
              } else if (data.result[i] == "R") {
                newCellColors[currentRow][i] = "yellow";
              } else {
                newCellColors[currentRow][i] = "red";
              }
            }

            setCellColors(newCellColors);

            setCurrentRow(currentRow + 1);
            setCurrentCol(0);
          }
        } catch (error) {
          console.error("Error sending guess:", error);
        }

        try {
          const res = await fetch("http://localhost:3001/game-over");
          const data = await res.json();
          setGameOver(data.gameOver);
          console.log(data.wordCurrent);
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            Here is a gentle confirmation that your action was successful.
          </Alert>;
        } catch (error) {
          console.error("Error ending game");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentRow, currentCol, grid, cellColors, gameOver]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        padding: 2,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        {gameStarted ? "Wordle Game Started!" : "Loading..."}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ backgroundColor: "red" }}
        onClick={() => window.location.reload()}
      >
        {" "}
        Restart Game{" "}
      </Button>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 4 }}
      >
        {grid.map((row, rowIndex) => (
          <Box key={rowIndex} sx={{ display: "flex", gap: 1 }}>
            {row.map((letter, colIndex) => (
              <Box
                key={colIndex}
                sx={{
                  width: 60,
                  height: 60,
                  border: "2px solid #d3d6da",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  backgroundColor: cellColors[rowIndex][colIndex], // <-- use color here
                  borderColor:
                    rowIndex === currentRow &&
                    colIndex === currentCol &&
                    !gameOver
                      ? "#000"
                      : "#d3d6da",
                  borderWidth:
                    rowIndex === currentRow && colIndex === currentCol
                      ? "3px"
                      : "2px",
                }}
              >
                {letter}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
