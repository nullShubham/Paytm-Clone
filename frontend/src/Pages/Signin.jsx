import React, { useEffect, useState } from 'react'
import { Input, Button, Heading, SubHeading, Footer, LoginScelton } from "../Components/index"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import checkUserLoggedIn from '../Features/checkUserLoggedIn'


const Signin = () => {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPassVisible, setIsPassVisible] = useState(false)
  const [authState, setAuthState] = useState(null)
  const [btnDiable, setBtnDisable] = useState(false)

  // check auth
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await checkUserLoggedIn();
      if (isLoggedIn) {
        setAuthState(true)
        navigate("/dashboard")
      } else {
        setAuthState(false)
      }
    }
    checkAuth();
  }, [navigate])

  const loginAcc = async () => {
    setBtnDisable(true)
    setIsLoading(true)
    try {
      const hosted = import.meta.env.VITE_SERVER_URL + "/user/signin"
      if (!(userName && password)) {
        setError("Fill all fields")
        return
      }
      if (password.length < 8) {
        setError("Password should be of minimum 8 letters")
        return
      }
      const res = await axios.post(hosted, {
        userName,
        password
      });
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("urName", res.data.firstName)
      navigate("/dashboard")
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setBtnDisable(false)
      setIsLoading(false)
      setTimeout(() => {
        setError(null)
      }, 2000);
    }
  }
  // loading
  if (authState == null) {
    return <LoginScelton />
  }
  //  show login form if user dont logged in
  if (authState == false) {
    return (
      <div className='w-full bg-gray-100 min-h-screen flex items-center justify-center'>
        <form className='bg-white rounded-lg px-8 w-80 sm:w-96 flex flex-col'>
          <Heading heading={"Sign In"} />
          <SubHeading subHeading={"Enter your information to access your account"} />
          <Input onChange={(e) => setUserName(e.target.value)} id='email' label="Email" placeholder='JohnDoe@example.com' type='email' />
          <label className="mt-2 text-base font-medium" htmlFor={"pass"}>{"Password"}</label>
          <div className='border flex items-center p-2 rounded-lg'>
            <input onChange={(e) => setPassword(e.target.value)} className="w-full text-sm leading-none outline-none" type={`${isPassVisible ? "text" : 'password'}`} id={"pass"} required />
            <i onClick={() => setIsPassVisible(!isPassVisible)} className={`fa-regular cursor-pointer ${isPassVisible ? "fa-eye" : "fa-eye-slash"}`}></i>
          </div>
          {error &&
            <p className='text-center text-sm text-red-400 mt-1'>{error}</p>
          }
          <Button disable={btnDiable} onClick={loginAcc} btnText={` ${isLoading ? "...." : "Sign In"} `} />
          <Footer text={"Don't have an account?"} toLink={"/signup"} toText="Sign up" />
        </form>
      </div>
    )
  }
}



export default Signin