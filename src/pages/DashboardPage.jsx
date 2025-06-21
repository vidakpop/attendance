import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../utils/api'
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa'
import { toast } from 'react-hot-toast';
import {motion, AnimatePresence} from 'framer-motion'

const DashboardPage = () => {
  const navigate = useNavigate()
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(false)
  const [signedInStudents, setSignedInStudents] = useState([])

  // Fetch classes on mount
  useEffect(() => {
    {/* Check if user is authenticated 
    const checkAuth = async () => {
      try {
        await API.get('auth/user')
      } catch (error){
        toast.error('❌ Please log in to access the dashboard.')
        navigate('/')
      }
    }
    checkAuth()*/}
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
    const today = new Date().toISOString().slice(0, 10);
    const signedIn = await Promise.all(
      studentList.map(async student => {
        try {
          const res = await API.get(`attendance/?student=${student.id}&date=${today}`);
          if (res.data.length > 0 && res.data[0].sign_in_time) {
            return { ...student, attendanceId: res.data[0].id };
          }
        } catch (err) {
          console.error(`Check sign-in failed for student ${student.id}:`, err);
        }
        return null;
      })
    );
    setSignedInStudents(signedIn.filter(Boolean));
  };

 const signInStudent = async (studentId) => {
  const today = new Date().toISOString().slice(0, 10);

  try {
    const res = await API.get(`attendance/?student=${studentId}&date=${today}`);
    let attendance = res.data.length > 0 ? res.data[0] : null;

    if (!attendance) {
      const createRes = await API.post('attendance/', { student: studentId, date: today });
      attendance = createRes.data;
    }

    // Optional: check if already signed in
    if (attendance.sign_in_time) {
      toast.success('⚠️ Student already signed in.');
      return;
    }

    await API.post(`attendance/${attendance.id}/sign_in/`);
    toast.success('✅ Student signed in successfully');
    loadStudents(selectedClassId); // Refresh students list
  } catch (err) {
    console.error('Sign in error:', err.response?.data || err.message || err);
    toast.error('❌ Failed to sign in student');
  }
};

  // Sign Out student
  const signOutStudent = async (studentId) => {
    const today = new Date().toISOString().slice(0, 10)

    try {
      const res = await API.get(`attendance/?student=${studentId}&date=${today}`)
      const attendance = res.data[0]

      if (!attendance) {
        toast.error('⚠️ Student has not signed in today.')
        return
      }

      await API.post(`attendance/${attendance.id}/sign_out/`)
      toast.success('📤 Student signed out successfully')
    } catch (err) {
      console.error('Sign out error:', err)
      toast.error('❌ Failed to sign out student')
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">📊 Attendance Dashboard</h1>

      <div className="mb-4">
        <label className="font-medium text-gray-700 text-lg">Select Class:</label>
        <select
          onChange={(e) => loadStudents(e.target.value)}
          className="ml-2 border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={selectedClassId || ''}
        >
          <option value="">-- Choose Class --</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500">⏳ Loading students...</p>}

      {students.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        <div className="bg-white rounded-lg shadow p-4 mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">🟢 Sign In Student</h2>
          <ul className="space-y-3">
            {students.filter(s => !signedInStudents.some(si => si.id === s.id)).map(student => (
              <li
                key={student.id}
                className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded shadow-sm"
              >
                <span className="font-medium text-gray-700">{student.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => signInStudent(student.id)}
                    className="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    <FaSignInAlt className="mr-1" /> Sign In
                  </button>
                
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='bg-white rounded-lg shadow p-4 mt-6'>
          <h2 className='text-xl font-semibold text-gray-700 mb-4'>🔴Sign Out Student</h2>
          <ul className='space-y-3'>
            {signedInStudents.map(student => (
              <li key={student.id} className='flex items-center justify-between bg-gray-50 px-4 py-2 rounded shadow-sm'>
                <span className='font-medium text-gray-700'>{student.name} </span>

                <div className='space-x-2'>
                  <button
                     onClick = {() => signOutStudent(student.id)}
                    className='flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded'
                  >
                    <FaSignOutAlt className='mr-1' />Sign Out
                  </button>

                </div>
              </li>
            ) 
            )}
          </ul>

        </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
