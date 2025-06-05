import React, { useEffect, useState } from 'react'
import API from '../utils/api'
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { BsDownload } from 'react-icons/bs'

const DashboardPage = () => {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [students, setStudents] = useState([])

  useEffect(() => {
    API.get('classes/')
      .then(res => setClasses(res.data))
      .catch(err => console.error(err))
  }, [])

  const loadStudents = (classId) => {
    if (!classId) {
      setStudents([])
      return
    }
    setSelectedClassId(classId)
    API.get(`students/?school_class=${classId}`)
      .then(res => {console.log("STUDENTS RESPONSEE",res.data)
        setStudents(res.data)
      })
      .catch(err => console.error(err))
  }

  const signInStudent = async (studentId) => {
    const today = new Date().toISOString().slice(0, 10)
    let attendance

    try {
      const res = await API.get(`attendance/?student=${studentId}&date=${today}`)
      attendance = res.data[0]
    } catch (err) {
    console.error("Error fetching attendance:", err.response || err)
  }

    if (!attendance) {
      const res = await API.post('attendance/', {
        student: studentId,
        date: today
      })
      attendance = res.data
    }

    await API.post(`attendance/${attendance.id}/sign_in/`)
    alert('✅ Student signed in successfully')
  }

  const signOutStudent = async (studentId) => {
    const today = new Date().toISOString().slice(0, 10)
    const res = await API.get(`attendance/?student=${studentId}&date=${today}`)
    const attendance = res.data[0]
    if (attendance) {
      await API.post(`attendance/${attendance.id}/sign_out/`)
      alert('📤 Student signed out successfully')
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Attendance Dashboard</h1>

      <div className="mb-4">
        <label className="font-medium">Select Class:</label>
        <select onChange={(e) => loadStudents(e.target.value)} className="ml-2 border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">-- Choose Class --</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">👨‍🎓 Students</h2>
          <ul className="space-y-3">
            {students.map(student => (
              <li key={student.id} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded shadow-sm">
                <span className="font-medium text-gray-700">{student.name}</span>
                <div className="space-x-2">
                  <button onClick={() => signInStudent(student.id)} className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    <FaSignInAlt className="mr-1" /> Sign In
                  </button>
                  <button onClick={() => signOutStudent(student.id)} className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    <FaSignOutAlt className="mr-1" /> Sign Out
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
