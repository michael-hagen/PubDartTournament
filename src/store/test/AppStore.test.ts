import { describe, expect, test } from 'vitest'
import { getState } from '../AppStore'

describe('utils.ts exports', () => {
  test('AppStore initial state', () => {
    const state = getState()

    expect(state.gameVariant).toBe('ELECTRONIC_DART')
  })
})
