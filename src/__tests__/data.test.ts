import { expect, test } from 'vitest'
import { MOCK_TRIPS } from '@/data/mockData'

test('Mock Data integrity', () => {
  // Test using a key that actually exists in MOCK_TRIPS, e.g. 'bangkok-trip-2024'
  expect(MOCK_TRIPS['bangkok-trip-2024']).toBeDefined()
  expect(MOCK_TRIPS['bangkok-trip-2024'].title).toContain('バンコク')
})
