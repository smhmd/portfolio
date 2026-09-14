import type { Direction } from 'src/lib/types'
import { uuid } from 'src/lib/utils'

import {
  type Board,
  LOCALSTORAGE_ID,
  type State,
  type Tile,
  TILE_SIZE,
  WIN_THRESHOLD,
} from './common'

type MoveProps = { board: Board; direction: Direction }

/**
 * Moves the tiles on the board in the specified direction and returns the updated board and a flag indicating if any tiles were moved.
 *
 * @example
 * const { board, updated } = moveTiles({
 *   board: [{ value: 2, x: 0, y: 0 }, { value: 2, x: 0, y: 1 }]
 *   direction: 'down',
 * })
 *         // (overlapping)
 * board   // [{value: 2, x: 0, y: 3}, {value: 2, x: 0, y: 3}]
 * updated // true
 */
export function moveTiles({
  board,
  direction,
}: MoveProps): Pick<State, 'board' | 'updated'> {
  /** Flag for when moveTiles function actually updated any tiles. */
  let updated = false
  const newBoard: Board = []

  const isForward = ['right', 'down'].includes(direction) // not efficient, but readable >_<
  const isVertical = ['up', 'down'].includes(direction)

  const groupBy = isVertical ? 'x' : 'y' // when the movement is vertical, "x" is constant so we can group by it
  const changeBy = isVertical ? 'y' : 'x' // when the movement is vertical, we change the "y" position

  /** for 'down' and 'right', we go backwards. for 'up' and 'left', we go forward  */
  const step = isForward ? -1 : 1

  /**
   * This will make this:
   * ```
   * [
   *   {x: 0, y: 1...},
   *   {x: 0, y: 2...},
   *   {x: 1, y: 3...}
   * ]
   * ```
   * into this:
   * ```
   * [
   *   // grouping into separate arrays by either "x" or "y"
   *   [ {x: 0, y: 1...}, {x: 0, y: 2...} ],
   *   // in this case, we're grouping by "x"
   *   [ {x: 1, y: 3...} ]
   * ]
   * ```
   * If we're moving vertically, we group by "x" and update the y's, otherwise we'll group by "y" and update the x's
   */
  const groups: Tile[][] = Array.from({ length: TILE_SIZE }).map(() => [])

  board.forEach((tile) => {
    const key = tile[groupBy]
    groups[key].push(tile)
  })

  groups.forEach((row) => {
    // We sort the row based on "x" or "y" to move in order
    row.sort((a, b) => {
      // If we're moving right or down, we reverse the sorting order.
      if (isForward) return b[changeBy] - a[changeBy]
      return a[changeBy] - b[changeBy]
    })

    // We hold the last value here to compare it against the next one.
    // If they're the same, we don't update `newPosition` which will make them overlap (have the same position, basically)
    let lastValue: number | null = null
    // If we're moving right or down, the new "x" or "y" should be starting from 3 down to 0
    // if we're moving left or up, the new "x" or "y" should be starting from 0 upwards to 3
    let newPosition = isForward ? TILE_SIZE : -1

    row.forEach((tile) => {
      // We skip updating `newPosition` if the current value matches the one from the previous tile. So that they will overlap
      if (tile.value !== lastValue) {
        newPosition += step
      }

      // Oh, something got updated
      if (tile[changeBy] !== newPosition) {
        updated = true
      }

      // We update "x" or "y" using the `newPosition`
      tile[changeBy] = newPosition

      if (tile.value === lastValue) {
        // We reset the lastValue when there is a match to not be greedy
        lastValue = null
      } else {
        // We update the lastValue to compare in the next iteration
        lastValue = tile.value
      }

      newBoard.push(tile)
    })
  })

  return {
    board: newBoard,
    updated,
  }
}

type MergeProps = Pick<State, 'board' | 'score' | 'best'>

/**
 * Merges the tiles on the board and updates the score based on tile combinations.
 *
 * Splitting moving and merging tiles allows us to animate them with ease.
 *
 * @example
 * const { board, score, best } = mergeTiles({
 *   board: [
 *     { value: 2, x: 0, y: 3 },
 *     { value: 2, x: 0, y: 3 }, // (overlapping)
 *   ],
 *   score: 0,
 *   best: 20,
 * })
 *
 * board // [{ value: 4, x: 0, y: 3 }] // merged in the same position
 * score // 4
 * best  // 20
 */
export function mergeTiles({ board, score, best }: MergeProps): MergeProps {
  let addedScore = 0

  /** Map{'0,0': Tile, '0,1': Tile} */
  const seenPositions = new Map<string, Tile>()

  const newBoard = board.reduce<Board>((acc, tile) => {
    const key = `${tile.x},${tile.y}`

    if (seenPositions.has(key)) {
      // If it's a duplicate, multiply the value of the first occurrence by 2
      const existingTile = seenPositions.get(key)

      if (existingTile) {
        existingTile.value *= 2 // Multiply only the first occurrence
        addedScore += existingTile.value
      }
      return acc // Skip adding the duplicate to the newBoard
    }
    seenPositions.set(key, tile) // Mark the combination as seen
    acc.push(tile) // Add the tile to the newBoard
    return acc
  }, [])

  const newScore = score + addedScore
  const newBest = best > newScore ? best : newScore

  return {
    board: newBoard,
    score: newScore,
    best: newBest,
  }
}

/**
 * Adds a new tile to the game board at a random available position.
 * A new tile can either have a value of 2 or 4, with a 10% chance of being 4.
 */
export function addTile(board: Board): Board {
  // No available positions
  if (board.length === TILE_SIZE * TILE_SIZE) return board

  // Track occupied positions using a boolean grid
  const occupied = Array.from({ length: TILE_SIZE }, () =>
    Array(TILE_SIZE).fill(false),
  )

  // Populate the occupied grid
  for (const tile of board) {
    occupied[tile.x][tile.y] = true
  }

  // Find a random available position using reservoir sampling
  // Hold x and y for the first available spot found, and keep updating until no more available spots are found.
  let availableCount = 0
  let selectedX = 0,
    selectedY = 0

  for (let x = 0; x < TILE_SIZE; x++) {
    for (let y = 0; y < TILE_SIZE; y++) {
      if (!occupied[x][y]) {
        availableCount++
        if (Math.random() < 1 / availableCount) {
          selectedX = x
          selectedY = y
        }
      }
    }
  }

  // Create the new tile
  const value = Math.random() < 0.1 ? 4 : 2 // 10% chance of 4, otherwise 2
  const id = uuid()
  const newTile: Tile = { id, x: selectedX, y: selectedY, value }

  return [...board, newTile]
}

/**
 * Checks if the game board is in a lost state, meaning there are no empty spaces
 * and no adjacent tiles with the same value that can be merged.
 */
export function checkLost(board: Board): boolean {
  if (board.length < TILE_SIZE * TILE_SIZE) return false

  const tileMap = new Map<string, number>()

  // Store tile values in a Map and check for empty spaces
  for (const { x, y, value } of board) {
    tileMap.set(`${x},${y}`, value)
  }

  // Check for possible moves
  for (const { x, y, value } of board) {
    // Possible moves (right and down)
    if (
      tileMap.get(`${x + 1},${y}`) === value || // Check right
      tileMap.get(`${x},${y + 1}`) === value // Check below
    ) {
      return false
    }
  }

  return true
}

type CheckWonProps = Pick<State, 'board' | 'won'>

/**
 * Checks if the game board is in a won state
 * and one of the tiles is above the win threshold.
 */
export function checkWon({ board, won }: CheckWonProps): boolean {
  if (won) return false // skip if already won
  return board.some((tile) => tile.value === WIN_THRESHOLD)
}

/**
 * Persist state in local storage.
 */
export function persistState(state: Partial<State>): void {
  try {
    localStorage.setItem(LOCALSTORAGE_ID, JSON.stringify(state))
  } catch {
    // A failed save must not break the game.
  }
}

/**
 * Initialize state (from local storage if available.)
 */
export function initializeState(): Partial<State> {
  try {
    const persisted = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_ID) || 'null',
    )
    if (persisted) return persisted
  } catch {
    // Fall through to a fresh board.
  }

  return { board: addTile(addTile([])) }
}

/**
 * Resets the game state, keeping "best" intact
 */
export function reset(state: State): State {
  const newState = {
    board: addTile(addTile([])),
    score: 0,
    updated: true,
    won: false,
    best: state.best,
  }

  persistState(newState)
  return newState
}
