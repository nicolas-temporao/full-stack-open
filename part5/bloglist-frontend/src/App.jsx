import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import './index.css'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
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
      const user = await loginService.login({username, password})
      
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showMessage(`Login Successful`, 'success')
    } catch (error){
      showMessage(`Wrong username or password`, 'error')
    }
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = {
        title,
        author,
        url
      }

      const createdBlog = await blogService.create(newBlog)
      

      const blogWithUser = {
        ...createdBlog,
        user
      }
      setBlogs(prevBlogs => prevBlogs.concat(blogWithUser))

      showMessage(`A new blog "${title}" by ${author} added`, 'success')
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error){
      showMessage('Failed to create new blog', 'error')
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
      } catch (error) {
        showMessage('Failed to delete blog', 'error')
      }
    }
  }
  
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <div>
      <Notification message={message} type={messageType} />

      {user === null ? (
        <>
          <h2>Log in to application</h2>
          <LoginForm
            username={username}
            password={password}
            handleUserChange={({ target }) => setUsername(target.value)}
            handlePassChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
        </>
      ) : (
        <>
          <p>{user.name} logged in.</p>
          <button onClick={handleLogout}>Logout</button>

          <Togglable buttonLabel="create new blog">
            <BlogForm
              title={title}
              author={author}
              url={url}
              handleTitleChange={({ target }) => setTitle(target.value)}
              handleAuthorChange={({ target }) => setAuthor(target.value)}
              handleUrlChange={({ target }) => setUrl(target.value)}
              handleNewBlog={handleNewBlog}
            />
          </Togglable>
        </>
      )}

      <h2>blogs</h2>

      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} user={user} handleRemove={handleRemove}/>
      )}
    </div>
  )
}

export default App