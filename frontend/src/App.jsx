import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { Dashboard, SendMoney, Signin, Signup, UpdateInfo } from "./Pages/index"
import checkUserLoggedIn from "./Features/checkUserLoggedIn"
import LoginScelton from "./Components/LoginScelton"
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update" element={<UpdateInfo />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="*" element={<Loader />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}


const Loader = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await checkUserLoggedIn();
      if (isLoggedIn) {
        navigate("/dashboard")
      } else {
        navigate("/signup")
      }
    }
    checkAuth();
  }, [])
  return (
    <LoginScelton />
  )
}
export default App