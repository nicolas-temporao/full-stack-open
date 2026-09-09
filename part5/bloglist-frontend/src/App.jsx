import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try { 
      const loggedUser = await loginService.login({username, password})

      setUser(loggedUser)
      setUsername('')
      setPassword('')

    } catch (error){
      console.log('wrong credentials')
    }
  }

    
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm username={username} password={password} handleUserChange={({target}) => setUsername(target.value)} handlePassChange={({target}) => setPassword(target.value)} handleLogin={handleLogin} />
      </div>
    )
  }



  return (
    <div>
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App