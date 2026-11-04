import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { IPost } from '@/types'
import GridPostList from './GridPostList'

vi.mock('@/context/UseUserContext', () => ({
  useUserContext: () => ({ user: { id: 'viewer-1' } }),
}))

vi.mock('@/lib/appwrite/api', () => ({
  getFilePreview: (fileId: string) => `/preview/${fileId}`,
}))

vi.mock('./PostStats', () => ({
  default: () => null,
}))

const createPost = (id: string): IPost => ({
  $id: id,
  $sequence: '1',
  $collectionId: 'posts',
  $databaseId: 'lumio',
  $createdAt: '2026-01-01T00:00:00.000Z',
  $updatedAt: '2026-01-01T00:00:00.000Z',
  $permissions: [],
  creator: {
    $id: 'creator-1',
    $sequence: '1',
    $collectionId: 'users',
    $databaseId: 'lumio',
    $createdAt: '2026-01-01T00:00:00.000Z',
    $updatedAt: '2026-01-01T00:00:00.000Z',
    $permissions: [],
    name: 'Creator',
    email: 'creator@example.com',
    accountId: 'account-1',
    imageUrl: '/avatar.png',
    posts: [],
  },
  imageUrl: `/image/${id}`,
  imageId: `image-${id}`,
})

const renderPosts = (prioritizeFirstPost = true) =>
  render(
    <MemoryRouter>
      <GridPostList
        posts={[createPost('first'), createPost('second')]}
        prioritizeFirstPost={prioritizeFirstPost}
      />
    </MemoryRouter>,
  )

describe('GridPostList', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('eagerly prioritizes only the first post image', () => {
    const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})
    renderPosts()

    const images = screen.getAllByAltText('post')
    expect(images[0].getAttribute('loading')).toBe('eager')
    expect(images[0].getAttribute('fetchPriority')).toBe('high')
    expect(images[1].getAttribute('loading')).toBe('lazy')
    expect(images[1].getAttribute('fetchPriority')).toBe('auto')
    expect(consoleLog).not.toHaveBeenCalled()
  })

  it('keeps every image lazy when this is not the first Explore page', () => {
    renderPosts(false)

    for (const image of screen.getAllByAltText('post')) {
      expect(image.getAttribute('loading')).toBe('lazy')
      expect(image.getAttribute('fetchPriority')).toBe('auto')
    }
  })
})
