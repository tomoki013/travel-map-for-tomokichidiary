import { expect, test } from 'vitest'
import { MOCK_TRIPS } from '@/data/mockData'

test('Mock Data integrity', () => {
  expect(MOCK_TRIPS['kyoto-2024']).toBeDefined()
  expect(MOCK_TRIPS['kyoto-2024'].title).toBe('Autumn in Kyoto')
})
