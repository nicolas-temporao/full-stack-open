import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import loginService from './services/login'
import Notification from './components/Notification'
import './index.css'

import {
  BrowserRouter as Router,
  Routes, Route, Link, Navigate
} from 'react-router-dom'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedInUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedInUserJSON) {
      const user = JSON.parse(loggedInUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showMessage = (text, type) => {
    setMessage(text)
    setMessageType(type)

    setTimeout(() => {
      setMessage(null)
      setMessageType(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showMessage('Login Successful', 'success')

    } catch {
      showMessage('Wrong username or password', 'error')
    }
  }

  const handleNewBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)

      const blogWithUser = {
        ...createdBlog,
        user
      }

      setBlogs(prevBlogs => prevBlogs.concat(blogWithUser))

      showMessage(`A new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success')
    } catch {
      showMessage('Failed to create blog', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedInUser')

  }

  const handleLike = async(blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    const returnedBlog = await blogService.update(blog.id, updatedBlog)

    const blogWithUser = {
      ...returnedBlog,
      user: blog.user
    }

    setBlogs(blogs.map(blog =>
      blog.id === blogWithUser.id ? blogWithUser : blog))
  }

  const handleRemove = async(blog) => {
    if (window.confirm(`Remove ${blog.title} by ${blog.author}?`)){
      try {
        await blogService.remove(blog.id)
        showMessage('Deleted blog successfully', 'success')
        setBlogs(prevBlogs =>
          prevBlogs.filter(b => b.id !== blog.id)
        )
      } catch {
        showMessage('Failed to delete blog', 'error')
      }
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <Router>
      <div>
        <Notification message={message} type={messageType} />

        <div>
          <Link to="/">blogs</Link>

          {user === null ? (
            <Link to="/login">login</Link>
          ) : (
            <div>
              <p>{user.name} logged in.</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <Routes>
          <Route
            path="/"
            element={
              <BlogList
                blogs={sortedBlogs}
                handleLike={handleLike}
                user={user}
                handleRemove={handleRemove}
                handleNewBlog={handleNewBlog}
              />
            }
          />

          <Route
            path="/login"
            element={
              user === null ? (
                <LoginForm
                  username={username}
                  password={password}
                  handleUserChange={({ target }) => setUsername(target.value)}
                  handlePassChange={({ target }) => setPassword(target.value)}
                  handleLogin={handleLogin}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App