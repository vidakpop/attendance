import React from 'react'
import { BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginPage/>}/>
        <Route path='/dashboard' element={<DashboardPage/>}/>
        {/* Add other routes here as needed */}
      </Routes>
    </Router>
  )
}

export default App