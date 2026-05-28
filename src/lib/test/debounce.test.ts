import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from '../utils' // Passe den Pfad entsprechend an

describe('debounce utility', () => {
  beforeEach(() => {
    // Enable fake timers to manually control setTimeout behavior
    vi.useFakeTimers()
  })

  afterEach(() => {
    // Restore real system timers after each test case
    vi.useRealTimers()
  })

  test('should delay the function execution until the specified delay has passed', () => {
    const callback = vi.fn()
    const debouncedFn = debounce(callback, 300)

    debouncedFn()

    // Immediately after invocation, the callback should not have been fired
    expect(callback).not.toHaveBeenCalled()

    // Fast-forwarding 299ms (1ms short of the delay)
    vi.advanceTimersByTime(299)
    expect(callback).not.toHaveBeenCalled()

    // Advancing the final millisecond to reach the 300ms threshold
    vi.advanceTimersByTime(1)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should discard prior invocations and reset the timer if called within the delay period', () => {
    const callback = vi.fn()
    const debouncedFn = debounce(callback, 300)

    // First invocation
    debouncedFn()
    
    // Advance time by 200ms (callback is still pending)
    vi.advanceTimersByTime(200)
    
    // Second invocation inside the window -> The 300ms timer must restart from scratch
    debouncedFn()

    // Advance another 200ms (total of 400ms since the 1st call, but only 200ms since the 2nd call)
    vi.advanceTimersByTime(200)
    expect(callback).not.toHaveBeenCalled()

    // Callback should fire only when 300ms have fully elapsed since the SECOND invocation
    vi.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  test('should accurately pass all arguments to the target callback function', () => {
    // A type-safe mock function expecting specific parameters (e.g., player name and target score)
    const callback = vi.fn<(name: string, score: number) => void>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debouncedFn = debounce(callback as any, 200)

    // Invoke with specific tournament sample data
    debouncedFn('Michael van Gerwen', 501)

    // Fast-forward past the delay
    vi.advanceTimersByTime(200)

    // Verify that the arguments arrived fully intact at the target function
    expect(callback).toHaveBeenCalledWith('Michael van Gerwen', 501)
  })

  test('should execute multiple times if individual invocations occur outside the delay window', () => {
    const callback = vi.fn()
    const debouncedFn = debounce(callback, 200)

    // First execution cycle
    debouncedFn()
    vi.advanceTimersByTime(200)
    expect(callback).toHaveBeenCalledTimes(1)

    // Idle for a while, then trigger the second execution cycle
    vi.advanceTimersByTime(1000)
    debouncedFn()
    vi.advanceTimersByTime(200)
    expect(callback).toHaveBeenCalledTimes(2)
  })
})