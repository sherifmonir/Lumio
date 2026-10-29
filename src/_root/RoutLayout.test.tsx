import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUserContext } from '@/context/UseUserContext'
import { INITIAL_STATE } from '@/context/AuthConstants'
import RoutLayout from './RoutLayout'

vi.mock('@/context/UseUserContext', () => ({
  useUserContext: vi.fn(),
}))

vi.mock('@/components/shared/bars/Bottombar', () => ({
  default: () => <div data-testid="bottom-bar" />,
}))
vi.mock('@/components/shared/bars/LeftSideBar', () => ({
  default: () => <div data-testid="left-sidebar" />,
}))
vi.mock('@/components/shared/bars/Topbar', () => ({
  default: () => <div data-testid="topbar" />,
}))

const Location = () => {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

const renderProtectedRoute = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Location />
      <Routes>
        <Route path="/sign-in" element={<p>Sign-in route</p>} />
        <Route path="/" element={<RoutLayout />}>
          <Route index element={<p>Home feed</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('RoutLayout', () => {
  beforeEach(() => {
    vi.mocked(useUserContext).mockReset()
  })

  it('waits for auth state before rendering or redirecting', () => {
    vi.mocked(useUserContext).mockReturnValue({
      ...INITIAL_STATE,
      isAuthenticated: false,
      isLoading: true,
    })

    renderProtectedRoute()

    expect(screen.queryByText('Home feed')).toBeNull()
    expect(screen.queryByText('Sign-in route')).toBeNull()
  })

  it('redirects unauthenticated users to sign-in', () => {
    vi.mocked(useUserContext).mockReturnValue({
      ...INITIAL_STATE,
      isAuthenticated: false,
      isLoading: false,
    })

    renderProtectedRoute()

    expect(screen.getByTestId('location').textContent).toBe('/sign-in')
    expect(screen.getByText('Sign-in route')).toBeTruthy()
  })

  it('renders the authenticated route and shared navigation', () => {
    vi.mocked(useUserContext).mockReturnValue({
      ...INITIAL_STATE,
      isAuthenticated: true,
      isLoading: false,
    })

    renderProtectedRoute()

    expect(screen.getByText('Home feed')).toBeTruthy()
    expect(screen.getByTestId('topbar')).toBeTruthy()
    expect(screen.getByTestId('left-sidebar')).toBeTruthy()
    expect(screen.getByTestId('bottom-bar')).toBeTruthy()
  })
})
