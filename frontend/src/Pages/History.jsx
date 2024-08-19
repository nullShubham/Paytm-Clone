import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Card, LoaderForHistory } from "../Components/index"
const History = () => {
  const [transactionHistory, setTransactionHistory] = useState(null)
  const [error, setError] = useState(null)
  const [myId, setMyId] = useState(null)

  // getting transaction history
  useEffect(() => {
    const fetchTransaction = async () => {
      const url = import.meta.env.VITE_SERVER_URL + "/history/gethistory";
      try {
        const data = await axios.post(url, {}, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("authToken")
          }
        })
        setTransactionHistory(data.data.transactionsHistory);
        setMyId(data.data.yourId)
      } catch (error) {
        setTransactionHistory([])
        setError(error.response.data.message);
      }
    }
    fetchTransaction()
  }, [])

  // Loader

  if (transactionHistory == null) {
    return (
      <LoaderForHistory />
    )
  }
  // error in getting transaction
  if (error) {
    return <>
      <div className="grid place-content-center text-center bg-white px-4">
        <h1 className="uppercase font-bold tracking-widest text-gray-500">Make some transactions</h1>
        <h1 className="uppercase  text-gray-500">{error}</h1>
      </div>
    </>


  }

  if (transactionHistory.length > 0) {
    return (
      <div className=' min-h-fit'>
        < div className='flex items-center justify-between px-5 md:px-10 border-b h-20' >
          <h1 className='font-bold text-lg md:text-2xl text-gray-700 leading-none uppercase'>Payments</h1>
        </div >
        <div className='py-10 card-container'>
          <div className='px-10 flex flex-wrap justify-center gap-4'>
            {transactionHistory.map(t => (
              <Card key={t._id} myId={myId} historyDetails={{ ...t }} />
            ))}
          </div>
        </div>
      </div >
    )
  }
}

export default History