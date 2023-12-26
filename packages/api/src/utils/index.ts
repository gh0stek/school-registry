export function calculateAverage(arr: number[]): number {
  if (arr.length === 0) {
    return 0
  }

  const sum = arr.reduce((acc, val) => acc + val, 0)
  return sum / arr.length
}

export function calculateMedian(arr: number[]): number {
  if (arr.length === 0) {
    return 0
  }

  const sorted = [...arr].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[middle] + sorted[middle - 1]) / 2
  }

  return sorted[middle]
}
