import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import Notification from './components/Notification'
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
    const newBlog = {
      title,
      author,
      url
    }

    const createdBlog = await blogService.create(newBlog)
    showMessage(`A new blog "${title}" by ${author} added`, 'success')

    setBlogs(blogs.concat(createdBlog))

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
  }

    
  if (user === null) {
    return (
      <div>
        <Notification message={message} type={messageType}/>
        <h2>Log in to application</h2>
        <LoginForm 
          username={username}
          password={password} 
          handleUserChange={({target}) => setUsername(target.value)} 
          handlePassChange={({target}) => setPassword(target.value)} 
          handleLogin={handleLogin}
        />
      </div>
    )
  }



  return (
    <div>
      <Notification message={message} type={messageType}/>
      <p>{user.name} logged in.</p>
      <button onClick={handleLogout}>Logout</button>
      <BlogForm   
        title={title}
        author={author}
        url={url}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleUrlChange={({ target }) => setUrl(target.value)}
        handleNewBlog={handleNewBlog}
       />
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>

  )
}

export default App