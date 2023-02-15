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

export function calculateOutput(inputText: string) {
  if (inputText.length > MAX_INSTRUCTION_LENGTH) {
    return [
      `Instructions must be less than ${MAX_INSTRUCTION_LENGTH} characters`,
    ];
  }

  const { robotsInfo, world } = parseInput(inputText);

  const output = calculateWorldOutput(robotsInfo, world);

  return output;
}

function parseInput(inputText: string) {
  const lines = inputText.trim().split("\n");

  const world: Coordinate = {
    x: parseInt(lines[0].charAt(0)),
    y: parseInt(lines[0].charAt(2)),
  };

  const robotsInfo: RobotInfo[] = [];

  const robotInfoLines = lines
    .slice(1) // removes the first line (the world information)
    .filter((line) => !!line); // removes the empty lines

  for (const [index, line] of robotInfoLines.entries()) {
    // robots information is a pair of two lines. It skips the odd line (the instructions).
    if (isEven(index)) {
      robotsInfo.push({
        position: {
          coordinate: {
            x: parseInt(line.charAt(0)),
            y: parseInt(line.charAt(2)),
          },
          direction: line.charAt(4) as Direction,
        },
        // it assumes the following line (odd) has the instructions
        instructions: robotInfoLines[index + 1].split("") as Instructions,
      });
    }
  }

  return {
    robotsInfo,
    world,
  };
}

function calculateWorldOutput(robotsInfo: RobotInfo[], world: Coordinate) {
  const outputs: string[] = [];
  const scents: Coordinate[] = [];

  for (const robotInfo of robotsInfo) {
    const { lastPosition, lostAt } = calculateSingleRobotOutput({
      robotInfo,
      world,
      scents,
    });

    if (lostAt) scents.push(lostAt);

    outputs.push(
      `${lastPosition.coordinate.x} ${lastPosition.coordinate.y} ${
        lastPosition.direction
      }${lostAt ? " LOST" : ""}`
    );
  }

  return outputs;
}

function calculateSingleRobotOutput({
  robotInfo,
  world,
  scents,
}: {
  robotInfo: RobotInfo;
  world: Coordinate;
  scents: Coordinate[];
}) {
  let currentPosition: Position = robotInfo.position;
  let lostAt: Coordinate | null = null;

  for (const instruction of robotInfo.instructions) {
    if (instruction === "F") {
      const nextCoordinate = getNextCoordinate(currentPosition);

      if (hasScent(nextCoordinate, scents)) {
        continue;
      }

      if (isOutsideOfTheWorld(nextCoordinate, world)) {
        lostAt = nextCoordinate;
        break;
      }

      currentPosition = {
        coordinate: nextCoordinate,
        direction: currentPosition.direction,
      };
    } else {
      currentPosition = {
        coordinate: currentPosition.coordinate,
        direction: getNextDirection(currentPosition.direction, instruction),
      };
    }
  }

  return {
    lastPosition: currentPosition,
    lostAt,
  };
}

function hasScent(coordinate: Coordinate, scents: Coordinate[]) {
  for (const scent of scents) {
    if (scent.x === coordinate.x && scent.y === coordinate.y) return true;
    return false;
  }
}

function isOutsideOfTheWorld(coordinate: Coordinate, world: Coordinate) {
  if (coordinate.x > world.x || coordinate.y > world.y) return true;
  return false;
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
