import React, { useEffect, useState } from 'react'
import { Input, LoaderForUpdateInfo, Heading, Button } from "../Components/index"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import checkUserLoggedIn from '../Features/checkUserLoggedIn'

const UpdateInfo = () => {
  const navigate = useNavigate()
  const [authState, setAuthState] = useState(null)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [isBtnDisabled, setIsBtnDisabled] = useState(false)
  // check auth
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await checkUserLoggedIn();
      if (isLoggedIn) {
        setAuthState(true)
      } else {
        navigate("/signup")
        setAuthState(false)
      }
    }
    checkAuth();
  }, [navigate])


  let updatedData = {};
  if (firstName.length > 0) updatedData.firstName = firstName
  if (lastName.length > 0) updatedData.lastName = lastName
  if (password.length > 0) updatedData.password = password

  // update user details
  const updateInfoOfUser = async () => {
    setIsBtnDisabled(true)
    setIsLoading(true)
    if (updatedData.password < 8) {
      setError("Password should be of minimum 8 letters")
      return
    }
    if (updatedData.firstName != "") {
      localStorage.setItem("urName", updatedData.firstName)
    }
    if (Object.keys(updatedData).length !== 0) {
      try {
        const hosted = import.meta.env.VITE_SERVER_URL + "/user"
        const res = await axios.put(hosted, updatedData, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken")
          }
        });
        setSuccess(res.data.message);
      } catch (error) {
        setError(error.response.data.message);
      }
      finally {
        setIsBtnDisabled(false)
        setIsLoading(false)
        setTimeout(() => {
          setError(null)
        }, 2000);
        setTimeout(() => {
          setSuccess(null)
        }, 2000);
      }
    } else {
      setIsLoading(false)
      setError("Enter at least one updation")
      setTimeout(() => {
        setError(null)
      }, 2000);
    }
  }

  // delete Account
  const deleteAcc = async () => {
    setIsBtnDisabled(true)
    try {
      const hosted = import.meta.env.VITE_SERVER_URL + "/user/delete"
      const res = await axios.delete(hosted, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("authToken")
        }
      })
      localStorage.removeItem("authToken");
      localStorage.removeItem("urName")
      navigate("/signup")
      setSuccess(res.data.message)
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsBtnDisabled(false)
      setTimeout(() => {
        setError(null)
      }, 2000);
      setTimeout(() => {
        setSuccess(null)
      }, 2000);
    }

  }

  if (authState == null) {
    return (
      <LoaderForUpdateInfo />
    )
  }
  if (authState == true) {
    return (
      <div className='flex px-5 overflow-hidden items-center justify-center bg-gray-100 min-h-screen w-full'>
        <div className='flex flex-col md:w-96 w-full bg-white px-5 pb-5 rounded-lg'>
          <Heading heading={"Update Info"} />
          <Input onChange={(e) => setFirstName(e.target.value)} id={"newFirst"} label={"First Name"} placeholder={"John (Optional)"} type={"text"} />
          <Input onChange={e => setLastName(e.target.value)} id={"newLast"} label={"Last Name"} placeholder={"Doe (Optional)"} type={"text"} />
          <Input onChange={(e) => setPassword(e.target.value)} id={"newPass"} label={"Password"} placeholder={"(Optional)"} type={"password"} />
          {error &&
            <p className='text-center text-sm text-red-400 mt-1'>{error}</p>
          }
          {success &&
            <p className='text-center text-sm text-green-400 mt-1'>{success}</p>
          }
          <Button disable={isBtnDisabled} onClick={updateInfoOfUser} btnText={` ${isLoading ? "...." : "Update"} `} />
          <div className='flex gap-5'>
            <button disabled={isBtnDisabled} type="button" className="text-green-700 hover:text-white border border-green-700 hover:bg-red-800 mt-2 w-full  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600" onClick={() => navigate("/dashboard")}>Back</button>

            <button disabled={isBtnDisabled} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 mt-2 w-full  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600" onClick={() => {
              setIsBtnDisabled(true)
              localStorage.removeItem("authToken")
              localStorage.removeItem("urName")
              setIsBtnDisabled(false)
              navigate("/signin")
            }}>Log Out</button>
          </div>
          <button disabled={isBtnDisabled} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 mt-2 w-full  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600" onClick={deleteAcc}>Delete Account</button>
        </div>
      </div>
    )
  }

}

export default UpdateInfo