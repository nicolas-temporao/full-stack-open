import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { BlogDetails } from './BlogView'

describe('Blog Details:', () =>{
    const blog = {
        id: '12345',
        title: 'Test blog',
        author: 'Nick',
        url: 'https://test.com',
        likes: 5,
        user: {
            id: '1',
            name: 'Nick',
            username: 'nick'
        }
    }

    test('NOT logged in: can see blog info but no buttons', () => {
        const handleLike = vi.fn()
        const handleRemove = vi.fn()

        render(
            <BlogDetails
                blog={blog}
                handleLike={handleLike}
                handleRemove={handleRemove}
                user={null}
            />
        )

        expect(screen.getByText('Test blog')).toBeVisible()
        expect(screen.getByText('https://test.com')).toBeVisible()
        expect(screen.getByText('likes 5')).toBeVisible()
        expect(screen.getByText('added by Nick')).toBeVisible()

        expect(screen.queryByRole('button', {name: 'like'})).toBeNull()
        expect(screen.queryByRole('button', {name: 'remove'})).toBeNull()

    })

    test('logged in user that is not creator of blog only sees like button', () => {
        const handleLike = vi.fn()
        const handleRemove = vi.fn()

        const otherUser = {
            id: 2,
            name: 'other',
            username: 'other123'
        }

        render(
            <BlogDetails
                blog={blog}
                handleLike={handleLike}
                handleRemove={handleRemove}
                user={otherUser}
            />
        )

        expect(screen.queryByRole('button', {name: 'like'})).toBeVisible()
        expect(screen.queryByRole('button', {name: 'remove'})).toBeNull()
    })

    test('creator sees both like and remove', () => {
        const handleLike = vi.fn()
        const handleRemove = vi.fn()

        const creator = {
            id: 1,
            name: 'Nick',
            username: 'nick'
        }

        render(
            <BlogDetails
                blog={blog}
                handleLike={handleLike}
                handleRemove={handleRemove}
                user={creator}
            />
        )

        expect(screen.queryByRole('button', {name: 'like'})).toBeVisible()
        expect(screen.queryByRole('button', {name: 'remove'})).toBeVisible()
    })
})