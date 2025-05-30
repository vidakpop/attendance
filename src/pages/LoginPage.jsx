import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const login = async (e) => {
      e.preventDefault()
      try {
        const res = await axios.post('http://localhost:8000/api/token/',{
          username,
          password
        })
        localStorage.setItem('access', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)
        navigate('/dashboard')
      }
      catch (error) {
        alert('Login failed. Please check your credentials.')
      }
    }

  return (
    <div>LoginPage</div>
  )
}

export default LoginPage