export const get1DPosition = (
  position: { col: number; row: number },
  gameColsCount: number
) => position.row * gameColsCount + position.col
