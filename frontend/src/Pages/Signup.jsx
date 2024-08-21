import React, { useEffect, useState } from 'react'
import { Input, Button, Heading, SubHeading, Footer, LoginScelton } from "../Components/index"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
import checkUserLoggedIn from "../Features/checkUserLoggedIn"

const Signup = () => {

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPassVisible, setIsPassVisible] = useState(false)
  const [authState, setAuthState] = useState(null)
  const [isBtnDisable, setIsBtnDisable] = useState(false)
  const navigate = useNavigate()
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

  // create account
  const createAcc = async () => {
    setIsBtnDisable(true)
    setIsLoading(true)
    try {
      const hosted = import.meta.env.VITE_SERVER_URL + "/user/signup"
      if (!(firstName && lastName && userName && password)) {
        setError("Fill all fields")
        return
      }
      if (password.length < 8) {
        setError("Password should be of minimum 8 letters")
        return
      }
      const res = await axios.post(hosted, {
        firstName,
        lastName,
        userName,
        password
      });
      localStorage.setItem("tokenOfAuth", res.data.token);
      localStorage.setItem("urName", res.data.firstName)
      navigate("/dashboard")
    } catch (error) {
      setError(error.response?.data?.message ?? error.message);
    } finally {
      setIsBtnDisable(false)
      setIsLoading(false)
      setTimeout(() => {
        setError(null)
      }, 2000);
    }
  };

  // loading
  if (authState == null) {
    return (
      <LoginScelton />
    )
  }
  // show signup page if user not logged in
  if (authState == false) {
    return (
      <div className='overflow-hidden w-full bg-gray-100 min-h-screen flex items-center justify-center'>
        <form className='bg-white rounded-lg px-8 w-80 sm:w-96 flex flex-col'>
          <Heading heading={"Sign Up"} />
          <SubHeading subHeading={"Enter your information to create an account"} />
          <Input onChange={e => setFirstName(e.target.value)} id='firstName' label="First Name" placeholder='John' type='text' />
          <Input onChange={e => setLastName(e.target.value)} id='lastName' label="Last Name" placeholder='Doe' type='text' />
          <Input onChange={e => setUserName(e.target.value)} id='email' label="Email" placeholder='JohnDoe@example.com' type='email' />
          <label className="mt-2 text-base font-medium" htmlFor={"pass"}>{"Password"}</label>
          <div className='border flex items-center p-2 rounded-lg'>
            <input onChange={(e) => setPassword(e.target.value)} className="w-full text-sm leading-none outline-none" type={`${isPassVisible ? "text" : 'password'}`} id={"pass"} required />
            <i onClick={() => setIsPassVisible(!isPassVisible)} className={`fa-regular cursor-pointer ${isPassVisible ? "fa-eye" : "fa-eye-slash"}`}></i>
          </div>
          {error &&
            <p className='text-center text-sm text-red-400 mt-1'>{error}</p>
          }
          <Button disable={isBtnDisable} btnText={` ${isLoading ? "...." : "Sign Up"} `} onClick={createAcc} />
          <Footer text={"Already have an account?"} toLink={"/signin"} toText="Sign in" />
        </form>
      </div>

    )
  }
}



export default Signup