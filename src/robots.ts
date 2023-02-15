import { MAX_INSTRUCTION_LENGTH } from "./config";
import { Coordinate, Direction, Instructions, RobotInfo } from "./types";
import { isEven } from "./utils";

export function calculateOutput(rawInstructions: string) {
  if (rawInstructions.length > MAX_INSTRUCTION_LENGTH) {
    return `Instructions must be less than ${MAX_INSTRUCTION_LENGTH} characters`;
  }

  const inputLines = rawInstructions.trim().split("\n");

  const world: Coordinate = {
    x: parseInt(inputLines[0].charAt(0)),
    y: parseInt(inputLines[0].charAt(2)),
  };

  const robotsInfo: RobotInfo[] = [];

  const robotInfoLines = inputLines
    .slice(1) // removes the first line (the world information)
    .filter((line) => !!line); // removes the empty lines

  for (const [index, line] of robotInfoLines.entries()) {
    if (isEven(index)) {
      robotsInfo.push({
        position: {
          coordinate: {
            x: parseInt(line.charAt(0)),
            y: parseInt(line.charAt(2)),
          },
          direction: line.charAt(4) as Direction,
        },
        instructions: robotInfoLines[index + 1].split("") as Instructions,
      });
    }
  }

  console.log(robotsInfo);

  return "------";
}
