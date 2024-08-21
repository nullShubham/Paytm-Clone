import React, { useEffect, useState } from 'react'
import { Heading, Avatar, SendMoneyLoader } from "../Components/index";
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from 'axios'
import checkUserLoggedIn from '../Features/checkUserLoggedIn'

const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState()
  const id = searchParams.get("id");
  const name = searchParams.get("name")

  // check user auth
  const navigate = useNavigate()
  const [authState, setAuthState] = useState(null)
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
    if (!id || !name) {
      navigate("/dashboard")
      return;
    }
    checkAuth();
  }, [navigate])

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [isBtnDisable, setIsBtnDisable] = useState(false)
  // Sending money
  const sendMoneyToUser = async () => {
    setIsBtnDisable(true)
    setIsLoading(true);
    try {
      let parsedAmount = parseFloat(amount)
      if (parsedAmount <= 0) {
        setIsLoading(false)
        setError("amount should be more than 0 ")
        return
      }
      const hosted = import.meta.env.VITE_SERVER_URL + "/account/transfer"
      const res = await axios.post(hosted, {
        to: id,
        amount: parsedAmount
      },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("tokenOfAuth")
          }
        }
      )
      setSuccess(res.data.message);
    } catch (error) {
      setError(error.response.data.message);
    }
    finally {
      setIsBtnDisable(false)
      setAmount("")
      setIsLoading(false)
      setTimeout(() => {
        setError(null)
      }, 2000);
      setTimeout(() => {
        setSuccess(null)
      }, 2000);
    }
  }

  // Loader
  if (authState == null) {
    return (
      <SendMoneyLoader />
    )
  }

  if (authState == true) {
    return (
      <div className=' flex px-5 bg-gray-100 items-center justify-center min-h-screen'>
        <div className='w-96 flex flex-col bg-white rounded-lg pb-6 px-6 gap-4 '>
          <Heading heading={"Send Money"} />
          <div className='flex items-center gap-2 flex-col justify-center'>
            <Avatar name={name && name[0].toUpperCase()} className="text-white bg-green-500" />
            <h3 className='font-semibold'>
              {name}
            </h3>
          </div>
          <div>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="number" placeholder='Enter amount' className='border w-full px-2 py-1 rounded-lg outline-none' />
          </div>
          {error &&
            <p className='text-center text-sm text-red-400 mt-1'>{error}</p>
          }
          {success &&
            <p className='text-center text-sm text-green-400 mt-1'>{success}</p>
          }
          <button disabled={isBtnDisable} onClick={sendMoneyToUser} className={`text-white bg-green-400 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-400 dark:hover:bg-green-600 w-full`}>{`${isLoading ? "..." : "Send"}`}</button>

          <button onClick={() => navigate("/dashboard")} type="button" className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800  w-full  focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600">Back</button>
        </div>
      </div>)
  }
}

export default SendMoney
