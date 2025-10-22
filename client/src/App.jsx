import { useState } from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import MainLayout from './dashboard/layouts/MainLayout'
import AdminIndex from './dashboard/pages/AdminIndex'
import Login from './dashboard/pages/Login'
import ProtectDashboard from './middleware/ProtectDashboard'
import ProtectRole from './middleware/ProtectRole';
import Unable from './dashboard/pages/Unable';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectDashboard />} >
          <Route path='' element={<MainLayout/>}>
              <Route path='' element={store.userInfo?.role === 'admin' ? <Navigate to='/dashboard/admin'  /> : <Navigate to='/dashboard/unable-access' />} />
              <Route path='unable-access' element={<Unable/>} />
              <Route path='news/*' element={<ProtectRole><News/></ProtectRole>} />
              <Route path='profile' element={<ProtectRole><Profile/></ProtectRole>} />
              <Route path='writers/*' element={<ProtectRole><Writers/></ProtectRole>} />
              <Route path='writer/add' element={<ProtectRole><AddWriter/></ProtectRole>} />
              <Route path='admin' element={<AdminIndex/>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

