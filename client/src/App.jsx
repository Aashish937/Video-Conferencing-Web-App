import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/Auth/AuthForm';
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import IsLogin from './pages/Auth/IsLogin.jsx';
function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<IsLogin />}>
          <Route path='/' element={<Dashboard />} />
        </Route>
        <Route path='/signup' element={<AuthForm type="signup" />} />
        <Route path='/login' element={<AuthForm type="login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
