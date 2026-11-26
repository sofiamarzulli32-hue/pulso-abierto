import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { useFavoritesStore } from '../store/favoritesStore'

afterEach(() => {
  cleanup()
  localStorage.clear()
  useFavoritesStore.setState({ favoriteIds: [] })
})
