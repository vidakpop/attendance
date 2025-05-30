import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate =useNavigate()
  return (
    <div>LoginPage</div>
  )
}

export default LoginPage