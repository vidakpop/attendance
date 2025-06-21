import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api'
import { FaSignInAlt, FaSignOutAlt, FaUserGraduate, FaChalkboardTeacher, FaSearch } from 'react-icons/fa'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [signedInStudents, setSignedInStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  // Fetch classes on mount
  useEffect(() => {
    API.get('classes/')
      .then(res => setClasses(res.data))
      .catch(err => console.error('Error fetching classes:', err))
  }, [navigate])

  // Load students in a class
  const loadStudents = async (classId) => {
    setSelectedClassId(classId)
    if (!classId) {
      setStudents([])
      return
    }
    try {
      setLoading(true)
      const res = await API.get(`students/?school_class=${classId}`)
      setStudents(res.data)
      checkSignInStatus(res.data)
    } catch (err) {
      console.error('Error loading students:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkSignInStatus = async (studentList) => {
    const today = new Date().toISOString().slice(0, 10)
    const signedIn = await Promise.all(
      studentList.map(async student => {
        try {
          const res = await API.get(`attendance/?student=${student.id}&date=${today}`)
          if (res.data.length > 0 && res.data[0].sign_in_time) {
            return { ...student, attendanceId: res.data[0].id }
          }
        } catch (err) {
          console.error(`Check sign-in failed for student ${student.id}:`, err)
        }
        return null
      })
    )
    setSignedInStudents(signedIn.filter(Boolean))
  }

  const signInStudent = async (studentId) => {
    const today = new Date().toISOString().slice(0, 10)

    try {
      const res = await API.get(`attendance/?student=${studentId}&date=${today}`)
      let attendance = res.data.length > 0 ? res.data[0] : null

      if (!attendance) {
        const createRes = await API.post('attendance/', { student: studentId, date: today })
        attendance = createRes.data
      }

      if (attendance.sign_in_time) {
        toast('Student already signed in', {
          icon: 'ℹ️',
          style: {
            borderRadius: '12px',
            background: '#3B82F6',
            color: '#fff',
          },
        })
        return
      }

      await API.post(`attendance/${attendance.id}/sign_in/`)
      toast.success('Student signed in successfully', {
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      })
      loadStudents(selectedClassId)
    } catch (err) {
      console.error('Sign in error:', err.response?.data || err.message || err)
      toast.error('Failed to sign in student', {
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#fff',
        },
      })
    }
  }

  const signOutStudent = async (studentId) => {
    const today = new Date().toISOString().slice(0, 10)

    try {
      const res = await API.get(`attendance/?student=${studentId}&date=${today}`)
      const attendance = res.data[0]

      if (!attendance) {
        toast('Student has not signed in today', {
          icon: '⚠️',
          style: {
            borderRadius: '12px',
            background: '#F59E0B',
            color: '#fff',
          },
        })
        return
      }

      await API.post(`attendance/${attendance.id}/sign_out/`)
      toast.success('Student signed out successfully', {
        style: {
          borderRadius: '12px',
          background: '#10B981',
          color: '#fff',
        },
      })
      loadStudents(selectedClassId)
    } catch (err) {
      console.error('Sign out error:', err)
      toast.error('Failed to sign out student', {
        style: {
          borderRadius: '12px',
          background: '#EF4444',
          color: '#fff',
        },
      })
    }
  }

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSignedInStudents = signedInStudents.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
              <FaChalkboardTeacher className="mr-3 text-blue-600" />
              Attendance Dashboard
            </h1>
            <p className="text-gray-600">Manage student attendance with ease</p>
          </div>
          
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <label className="font-medium text-gray-700 text-lg mb-2 md:mb-0 md:mr-4">Select Class:</label>
            <select
              onChange={(e) => loadStudents(e.target.value)}
              className="border rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
              value={selectedClassId || ''}
            >
              <option value="">-- Choose Class --</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.name}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {students.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sign In Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FaSignInAlt className="mr-2" /> Sign In Students
                </h2>
              </div>
              <div className="p-4">
                {filteredStudents.filter(s => !signedInStudents.some(si => si.id === s.id)).length > 0 ? (
                  <ul className="space-y-3">
                    <AnimatePresence>
                      {filteredStudents.filter(s => !signedInStudents.some(si => si.id === s.id)).map(student => (
                        <motion.li
                          key={student.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <FaUserGraduate className="text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 block">{student.name}</span>
                              <span className="text-sm text-gray-500">ID: {student.student_id}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => signInStudent(student.id)}
                            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all hover:shadow-md"
                          >
                            <FaSignInAlt className="mr-2" /> Sign In
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No matching students found' : 'All students are signed in'}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sign Out Panel */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FaSignOutAlt className="mr-2" /> Signed In Students
                </h2>
              </div>
              <div className="p-4">
                {filteredSignedInStudents.length > 0 ? (
                  <ul className="space-y-3">
                    <AnimatePresence>
                      {filteredSignedInStudents.map(student => (
                        <motion.li 
                          key={student.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-100 p-2 rounded-full mr-3">
                              <FaUserGraduate className="text-blue-600" />
                            </div>
                            <div>
                              <span className="font-medium text-gray-800 block">{student.name}</span>
                              <span className="text-sm text-gray-500">ID: {student.student_id}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => signOutStudent(student.id)}
                            className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all hover:shadow-md"
                          >
                            <FaSignOutAlt className="mr-2" /> Sign Out
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No matching students found' : 'No students signed in yet'}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {!loading && students.length === 0 && selectedClassId && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">No students found in this class</p>
          </div>
        )}

        {!loading && !selectedClassId && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg">Please select a class to view students</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage