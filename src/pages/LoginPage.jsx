import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { FaChalkboardTeacher, FaLock, FaUser } from 'react-icons/fa'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const login = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await axios.post('http://localhost:8000/api/token/', {
                username,
                password
            })
            localStorage.setItem('access', res.data.access)
            localStorage.setItem('refresh', res.data.refresh)
            navigate('/dashboard')
            toast.success(`Welcome back, ${username}!`, {
                icon: '👏',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            })
        } catch (error) {
            toast.error('Login failed. Please check your credentials.', {
                style: {
                    borderRadius: '10px',
                    background: '#ff4444',
                    color: '#fff',
                },
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="relative w-full max-w-md">
                {/* Floating school elements */}
                <div className="absolute -top-16 -left-16 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-float"></div>
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-400 rounded-full opacity-20 animate-float-delay"></div>
                <div className="absolute top-1/4 right-20 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-float"></div>

                <div className="relative bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                    {/* Decorative header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
                        <FaChalkboardTeacher className="w-16 h-16 mx-auto text-white" />
                        <h1 className="text-3xl font-bold text-white mt-4">SchoolSync</h1>
                        <p className="text-white/80 mt-2">Teacher Attendance Portal</p>
                    </div>

                    <form onSubmit={login} className="p-8 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaUser className="text-gray-400" />
                            </div>
                            <input
                                className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-gray-200"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </span>
                            ) : 'Login'}
                        </button>

                        <div className="text-center text-white/80 text-sm">
                            <a href="#" className="hover:text-white underline">Forgot password?</a>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center text-white/80 text-sm">
                    © {new Date().getFullYear()} SchoolSync Attendance System
                </div>
            </div>

            {/* Add some floating animation styles */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }
                @keyframes float-delay {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(20px);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delay {
                    animation: float-delay 7s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}

export default LoginPage