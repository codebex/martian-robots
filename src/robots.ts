import { MAX_INSTRUCTION_LENGTH } from "./config";
import {
  Coordinate,
  Direction,
  Instruction,
  Instructions,
  RobotInfo,
  Position,
} from "./types";
import { isEven } from "./utils";

const CARDINALS_CLOCKWISE: Direction[] = ["N", "E", "S", "W"];

export function calculateOutput(rawInstructions: string) {
  if (rawInstructions.length > MAX_INSTRUCTION_LENGTH) {
    return [
      `Instructions must be less than ${MAX_INSTRUCTION_LENGTH} characters`,
    ];
  }

  const inputLines = rawInstructions.trim().split("\n");

  const world: Coordinate = {
    x: parseInt(inputLines[0].charAt(0)),
    y: parseInt(inputLines[0].charAt(2)),
  };

  const scents: Coordinate[] = [];

  const outputs: string[] = [];

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

  for (const robotInfo of robotsInfo) {
    const { lastPosition, lostAt } = calculateRobotOutput(robotInfo);

    if (lostAt) scents.push(lostAt);

    outputs.push(
      `${lastPosition.coordinate.x} ${lastPosition.coordinate.y} ${
        lastPosition.direction
      }${lostAt ? " LOST" : ""}`
    );
  }

  return outputs;

  function calculateRobotOutput(robotInfo: RobotInfo) {
    const positionTracker: Position[] = [robotInfo.position];
    let lostAt: Coordinate | null = null;

    for (const instruction of robotInfo.instructions) {
      const currentPosition = positionTracker.at(-1)!;

      if (instruction === "F") {
        const nextCoordinate = getNextCoordinate(currentPosition);

        if (hasScent(nextCoordinate)) {
          continue;
        }

        if (isOutsideOfTheWorld(nextCoordinate)) {
          lostAt = nextCoordinate;
          break;
        }

        positionTracker.push({
          coordinate: nextCoordinate,
          direction: currentPosition.direction,
        });
      } else {
        positionTracker.push({
          coordinate: currentPosition.coordinate,
          direction: getNextDirection(currentPosition.direction, instruction),
        });
      }
    }

    return {
      lastPosition: positionTracker.at(-1)!,
      lostAt,
    };

    function isOutsideOfTheWorld(coordinate: Coordinate) {
      if (coordinate.x > world.x || coordinate.y > world.y) return true;
      return false;
    }

    function hasScent(coordinate: Coordinate) {
      for (const scent of scents) {
        if (scent.x === coordinate.x && scent.y === coordinate.y) return true;
        return false;
      }
    }
  }
}

function getNextDirection(
  currentDirection: Direction,
  instruction: Instruction
) {
  const currentCardinalIndex = CARDINALS_CLOCKWISE.findIndex(
    (cardinal) => currentDirection === cardinal
  );

  if (instruction === "L") {
    if (currentCardinalIndex === 0) return CARDINALS_CLOCKWISE.at(-1)!;
    return CARDINALS_CLOCKWISE[currentCardinalIndex - 1]!;
  }

  if (instruction === "R") {
    if (currentCardinalIndex === CARDINALS_CLOCKWISE.length - 1)
      return CARDINALS_CLOCKWISE.at(0)!;
    return CARDINALS_CLOCKWISE[currentCardinalIndex + 1]!;
  }

  return CARDINALS_CLOCKWISE[currentCardinalIndex];
}

function getNextCoordinate(position: Position) {
  const { x, y } = position.coordinate;

  switch (position.direction) {
    case "N":
      return {
        x,
        y: y + 1,
      };
    case "E":
      return {
        x: x + 1,
        y,
      };
    case "S":
      return {
        x,
        y: y - 1,
      };
    case "W":
      return {
        x: x - 1,
        y,
      };
    default:
      return position.coordinate;
  }
}
