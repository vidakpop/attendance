import React from 'react'
import { useEffect,useState } from 'react'
import API from '../utils/api'

const DashboardPage = () => {
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState(null)
  const [students, setStudents] = useState([])

  useEffect(() => {
    API.get('classes/').then(res => setClasses(res.data))
  }, [])
  const loadStudents = (classId) => {
    if (!classId){
      setStudents([])
      return;
    }
    setSelectedClassId(classId)
    API.get(`students/?school_clas=${classId}`).then(res => setStudents(res.data))
 }
   const signInStudent = async (studentId)=> {
    const today = new Date().toISOString().slice(0,10)
    let attendance;

    // Try to get todays attendance
    try {
      const res = await API.get(`attendance/?student=${studentId}&date=${today}`)
      attendance = res.data[0];
    }catch (err) {}

    if (!attendance) {
      const res = await API.post('attendance/',{
        student: studentId,
        date: today
      })
      attendance = res.data
    }
    await API.post(`attendance/${attendance.id}/sign_in/`)
    alert('Student signed in successfully')
   }

   const signOutStudent = async (studentId) => {
    const today = new Date().toISOString().slice(0,10)
    const res = await API.get(`attendance/?students=${studentId}&date=${today}`)
    const attendance = res.data[0]
    if (attendance){
      await API.post(`attendance/${attendance.id}/sign_out/`)
      alert('Student signed out successfully')
    }
   }

 
  

  return (
    <div className='p-6'>
      <h1 className='text-3xl font-bold  bold mb-4'>Attendance Dashboard</h1>

      <div className='mb-4'>
        <label>Select Class:</label>
        <select onChange={(e) = loadStudents(e.target.value)} className='border ml-2 p-1'>
          <option value="">Select</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>

      </div>

      {students.length > 0 && (
        <div>
          <h2 className='text-xl font-semibold mb-2'>
             
          </h2>
        </div>
      )}
    </div>
  )
}

export default DashboardPage