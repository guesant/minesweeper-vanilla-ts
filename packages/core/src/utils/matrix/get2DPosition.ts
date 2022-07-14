export const get2DPosition = (index: number, colsCount: number) => ({
  row: Math.floor(index / colsCount),
  col: index % colsCount
})
