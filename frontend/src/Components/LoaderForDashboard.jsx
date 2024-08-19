import React from 'react'

const LoaderForDashboard = () => {
    return (
        <div className="bg-white min-h-screen w-full overflow-hidden flex mt-5 px-5 gap-5 select-none ">
            <div className="flex flex-col w-full gap-5 ">
                <div className='flex justify-between '>
                    <div className="bg-gray-200 w-36 animate-pulse h-10 rounded-2xl" ></div>
                    <div className="bg-gray-200 w-36 animate-pulse h-10 rounded-2xl" ></div>
                </div>
                <div className="flex flex-1 flex-col gap-3">
                    <div className="bg-gray-200 w-full animate-pulse h-12 rounded-2xl" ></div>
                    <div className='h-1 bg-gray-200 w-full animate-pulse'></div>
                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-2'>
                            <div className="bg-gray-200 w-12 animate-pulse h-12 rounded-full" ></div>
                            <div className="bg-gray-200 w-40 animate-pulse h-8 rounded-lg" ></div>
                        </div>
                        <div className="bg-gray-200 w-40 animate-pulse h-10 rounded-lg" ></div>
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-2'>
                            <div className="bg-gray-200 w-12 animate-pulse h-12 rounded-full" ></div>
                            <div className="bg-gray-200 w-40 animate-pulse h-8 rounded-lg" ></div>
                        </div>
                        <div className="bg-gray-200 w-40 animate-pulse h-10 rounded-lg" ></div>
                    </div>
                    <div className='flex items-center justify-between gap-4'>
                        <div className='flex items-center gap-2'>
                            <div className="bg-gray-200 w-12 animate-pulse h-12 rounded-full" ></div>
                            <div className="bg-gray-200 w-40 animate-pulse h-8 rounded-lg" ></div>
                        </div>
                        <div className="bg-gray-200 w-40 animate-pulse h-10 rounded-lg" ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoaderForDashboard