import { act, render, screen, waitFor } from '@testing-library/react'
import { useContext } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AuthProvider from './AuthContect'
import { AuthContext } from './AuthConstants'

const getCurrentUserMock = vi.hoisted(() => vi.fn())

vi.mock('@/lib/appwrite/api', () => ({
  getCurrentUser: getCurrentUserMock,
}))

const AuthStatus = () => {
  const { isAuthenticated, isLoading, user, checkAuthUser } = useContext(AuthContext)

  return (
    <div>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="username">{user.username}</span>
      <button onClick={() => void checkAuthUser()}>Check auth</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    getCurrentUserMock.mockReset()
    window.history.replaceState({}, '', '/')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each(['/sign-in', '/sign-up'])('skips the account request on %s', async (path) => {
    window.history.replaceState({}, '', path)

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(getCurrentUserMock).not.toHaveBeenCalled()
  })

  it('skips the account request when Appwrite has no session cookie', async () => {
    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(getCurrentUserMock).not.toHaveBeenCalled()
  })

  it('loads and stores the current user when a session cookie exists', async () => {
    localStorage.setItem('cookieFallback', '{}')
    getCurrentUserMock.mockResolvedValue({
      $id: 'user-1',
      $sequence: '1',
      $collectionId: 'users',
      $databaseId: 'lumio',
      $createdAt: '2026-01-01T00:00:00.000Z',
      $updatedAt: '2026-01-01T00:00:00.000Z',
      $permissions: [],
      name: 'Lumio User',
      username: 'lumio-user',
      email: 'user@example.com',
      imageUrl: '/avatar.png',
      imageId: 'avatar-1',
      bio: 'Hello',
    })

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('true'))
    expect(screen.getByTestId('username').textContent).toBe('lumio-user')
    expect(getCurrentUserMock).toHaveBeenCalledOnce()
  })

  it('stays unauthenticated when no current user is returned', async () => {
    localStorage.setItem('cookieFallback', '{}')
    getCurrentUserMock.mockResolvedValue(null)

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
  })

  it('finishes loading and returns false when checking auth rejects', async () => {
    getCurrentUserMock.mockRejectedValue(new Error('Appwrite unavailable'))
    const consoleError = vi.spyOn(console, 'log').mockImplementation(() => {})

    render(
      <AuthProvider>
        <AuthStatus />
      </AuthProvider>,
    )

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'))

    await act(async () => {
      screen.getByRole('button', { name: 'Check auth' }).click()
    })

    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(consoleError).toHaveBeenCalledWith(expect.any(Error))
  })
})
