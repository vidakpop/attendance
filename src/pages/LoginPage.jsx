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
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <form onSubmit={login} className='bg-white p-8 rounded shadow-md w-96'>

      </form>

    </div>
  )
}

export default LoginPage