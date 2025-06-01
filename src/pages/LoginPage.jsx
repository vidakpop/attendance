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
        <h2 className='text-2xl font-bold mb-4'>Teacher Login</h2>
         <input className='w-full mb-2 p-2 border' placeholder='Username' value={username} onChange={e => setUsername(e.target.value)}/>
         <input type='password' className='w-full mb-4 p-2 border' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}/>
         <button className='w-full bg-blue-500 text-white p4 rounded' type='submit'>Login</button>


      </form>

    </div>
  )
}

export default LoginPage