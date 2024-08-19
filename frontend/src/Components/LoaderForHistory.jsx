import React from 'react'

const LoaderForHistory = () => {
    return (
        <div className="bg-white overflow-hidden select-none ">
            <div className="flex w-full gap-5 flex-wrap justify-center ">
                {Array(5).fill(0).map((a, i) => (
                    <div key={i} className="flex flex-col p-3 border-gray-200 border rounded-lg w-60 gap-3">
                        <div className="bg-gray-200 w-20 animate-pulse h-5 rounded-lg" ></div>
                        <div className="bg-gray-200 w-full animate-pulse h-8 rounded-lg" ></div>
                        <div className="bg-gray-200 w-20 animate-pulse h-5 rounded-lg" ></div>
                        <div className="bg-gray-200 w-full animate-pulse h-8 rounded-lg" ></div>
                        <div className="bg-gray-200 w-20 animate-pulse h-5 rounded-lg" ></div>
                        <div className="bg-gray-200 w-full animate-pulse h-8 rounded-lg" ></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LoaderForHistory