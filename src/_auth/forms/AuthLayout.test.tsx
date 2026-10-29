import { act, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import AuthLayout from './AuthLayout'
import { useUserContext } from '@/context/UseUserContext'
import { INITIAL_STATE } from '@/context/AuthConstants'

vi.mock('@/context/UseUserContext', () => ({
  useUserContext: vi.fn(),
}))

const mediaQueryListeners = new Set<(event: MediaQueryListEvent) => void>()
let desktopViewport = false

const setViewport = (isDesktop: boolean) => {
  desktopViewport = isDesktop
  const event = { matches: isDesktop } as MediaQueryListEvent
  mediaQueryListeners.forEach((listener) => listener(event))
}

const Location = () => {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

const renderAuthRoute = (initialPath = '/sign-in') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Location />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<p>Sign-in form</p>} />
        </Route>
        <Route path="/" element={<p>Home page</p>} />
      </Routes>
    </MemoryRouter>,
  )

describe('AuthLayout', () => {
  beforeEach(() => {
    mediaQueryListeners.clear()
    desktopViewport = false
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        get matches() {
          return query === '(min-width: 64rem)' && desktopViewport
        },
        media: query,
        onchange: null,
        addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          mediaQueryListeners.add(listener)
        },
        removeEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
          mediaQueryListeners.delete(listener)
        },
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
    vi.mocked(useUserContext).mockReturnValue({
      ...INITIAL_STATE,
      isAuthenticated: false,
      isLoading: false,
    })
  })

  it('does not request the side illustration on mobile', () => {
    renderAuthRoute()

    expect(screen.getByText('Sign-in form')).toBeTruthy()
    expect(screen.queryByAltText('Side Image')).toBeNull()
  })

  it('does not render auth content while auth state is loading', () => {
    vi.mocked(useUserContext).mockReturnValue({
      ...INITIAL_STATE,
      isLoading: true,
    })

    renderAuthRoute()

    expect(screen.queryByText('Sign-in form')).toBeNull()
  })

  it('loads the optimized side illustration only at the desktop breakpoint', () => {
    desktopViewport = true
    renderAuthRoute()

    const illustration = screen.getByAltText('Side Image')
    expect(illustration.getAttribute('src')).toBe('/assets/images/side-img.webp')
    expect(illustration.getAttribute('width')).toBe('720')
    expect(illustration.getAttribute('height')).toBe('1024')
    expect(illustration.getAttribute('fetchPriority')).toBe('high')
  })

  it('tracks viewport changes while the auth route is mounted', () => {
    renderAuthRoute()
    expect(screen.queryByAltText('Side Image')).toBeNull()

    act(() => setViewport(true))
    expect(screen.getByAltText('Side Image')).toBeTruthy()

    act(() => setViewport(false))
    expect(screen.queryByAltText('Side Image')).toBeNull()
  })

  it('redirects authenticated users to the home route', () => {
    vi.mocked(useUserContext).mockReturnValue({
      ...INITIAL_STATE,
      isAuthenticated: true,
      isLoading: false,
    })

    renderAuthRoute()

    expect(screen.getByTestId('location').textContent).toBe('/')
    expect(screen.getByText('Home page')).toBeTruthy()
  })
})
