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
    setSelectedClassId(classId)
    API.get(`students/?school_clas=${classId}`).then(res => setStudents(res.data))
}

  

  return (
    <div className='p-6'>
    </div>
  )
}

export default DashboardPage