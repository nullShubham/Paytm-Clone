import React, { useEffect, useState, useCallback } from 'react'
import { Avatar, LoaderForDashboard } from "../Components/index"
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom"
import checkUserLoggedIn from '../Features/checkUserLoggedIn'
import History from "./History"

const Dashboard = () => {
  const [filter, setFilter] = useState("")
  const [userList, setUserList] = useState([])
  const [inputVal, setInputVal] = useState("")
  const navigate = useNavigate()
  const [authState, setAuthState] = useState(null)

  // check user has account or not ?
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

  // debounce the search value
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSetFilter = useCallback(debounce((value) => {
    setFilter(value);
  }, 500), []);

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
    debouncedSetFilter(e.target.value);
  };

  // getting list of users
  useEffect(() => {
    const hosted = import.meta.env.VITE_SERVER_URL + "/user/bulk?filter="
    if (filter.includes(" ")) {
      return
    }
    axios.get(hosted + filter, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tokenOfAuth")
      }
    }).then(res => setUserList(res.data.user)).catch(err => console.log(err))
  }, [filter])

  // loader
  if (authState == null) {
    return (
      <LoaderForDashboard />

    )
  }

  if (authState == true) {
    return (
      <div>
        {/* Header */}
        <Header />
        {/* PaymentDetails */}
        <PaymentDetails />
        {/* Search Users */}
        <div className='mt-8 md:px-10 px-5'>
          <input value={inputVal} onChange={handleInputChange} type="text" className='outline-none border w-full p-2 rounded-lg' placeholder='Search users by username...' />
        </div>

        {/* Users List */}
        <div className='px-5 md:px-10 mt-8 pb-10 flex flex-col '>
          {userList.length > 0 && userList.map(user => (
            <User key={user._id} user={user} />
          ))}
        </div>
        {/* History */}
        <History />
      </div>
    )
  }
}
// Header
const Header = () => {
  const firstName = localStorage.getItem("urName")
  return (
    <div className='px-5 md:px-10 border-b h-20 flex items-center justify-between '>
      <h1 className='font-bold text-lg md:text-2xl text-gray-700 leading-none'>Payment App</h1>
      <div className="flex items-center gap-2">
        <h5 className='font-semibold text-gray-700 leading-none md:text-xl text-base'>Hello, {firstName && firstName}</h5>
        <Link to="/update">
          <Avatar name={firstName && firstName[0].toUpperCase()} className="text-black bg-gray-200" />
        </Link>
      </div>
    </div>
  )
}
// PaymentDetails

const PaymentDetails = () => {
  const [balance, setBalance] = useState("")
  // get payment details
  useEffect(() => {
    const getBalance = async () => {
      const hosted = import.meta.env.VITE_SERVER_URL + "/account/balance"
      try {
        const res = await axios.get(hosted, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("tokenOfAuth")
          }
        })
        setBalance(res.data.balance)
      } catch (error) {
        console.log("Error in fetch balance")
      }
    }
    getBalance()
  }, [])
  return (
    <div className='h-fit md:px-10 px-5 flex flex-col justify-between mt-5 font-bold text-xl'>
      <h2 className='text-gray-600'>
        Your Balance : <span className='text-blue-400'>${balance}</span>
      </h2>
    </div>
  )
}

// User List
const User = ({ user }) => {
  const navigate = useNavigate()
  return (
    <div className='border-b flex-col sm:flex-row flex w-full gap-2 sm:gap-0 sm:items-center sm:h-16  sm:justify-between'>
      <div className='flex mt-2 sm:mt-0 items-center gap-2'>
        <Avatar name={user.firstName[0].toUpperCase()} className="text-black bg-gray-200" />
        <div className='flex  flex-col gap-0.5'>
          <h3 className='font-medium text-gray-700 leading-none md:text-xl md:font-semibold text-base'>{user.firstName} {user.lastName}</h3>
          <span className='sm:text-sm text-[12px]  sm:leading-none font-medium text-gray-500'>{user.userName}</span>
        </div>
      </div>
      <button onClick={() => {
        navigate("/send?id=" + user._id + "&name=" + user.firstName)
      }} className={`w-28 mb-2 sm:mb-0 self-end sm:self-auto md:w-32 text-white bg-gray-800 hover:bg-gray-900 font-medium rounded-lg text-sm  dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2`}>{"Send Money"}</button>
    </div>
  )
}

export default Dashboard