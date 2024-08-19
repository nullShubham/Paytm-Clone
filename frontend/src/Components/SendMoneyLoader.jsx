import React from 'react'

const SendMoneyLoader = () => {
    return (
        <div className="bg-white w-full min-h-screen flex select-none ">
            <div className="flex px-5 items-center w-full  justify-center gap-5 ">
                <div className="flex w-96 flex-col gap-3 border-gray-200 border p-4 rounded-lg">
                    <div className="bg-gray-200 w-56 self-center animate-pulse h-8 rounded-2xl" ></div>
                    <div className="bg-gray-200 w-14 animate-pulse h-14 rounded-full self-center" ></div>
                    <div className="bg-gray-200 w-5/6 self-center animate-pulse h-8 rounded-lg" ></div>
                    <div className="bg-gray-200 w-5/6 self-center animate-pulse h-8 rounded-lg" ></div>
                    <div className="bg-gray-200 w-5/6 self-center animate-pulse h-8 rounded-lg" ></div>
                </div>

            </div>
        </div>
    )
}

export default SendMoneyLoader