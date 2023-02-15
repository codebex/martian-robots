export type Coordinate = {
  x: number;
  y: number;
};

export type Direction = "N" | "S" | "E" | "W";

export type Instruction = "L" | "R" | "F";

export type Instructions = Instruction[];

export type Position = {
  coordinate: Coordinate;
  direction: Direction;
};

export type RobotInfo = {
  position: Position;
  instructions: Instructions;
};
