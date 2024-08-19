import React from 'react'

const LoaderForUpdateInfo = () => {
    return (
        <div className="bg-white w-full min-h-screen flex select-none ">
            <div className="flex items-center w-full min-h-screen justify-center px-5 ">
                <div className="flex w-96 flex-col gap-3 border-gray-200 border p-4 rounded-lg">
                    <div className="bg-gray-200 w-56 self-center animate-pulse h-8 rounded-2xl" ></div>
                    <div className="bg-gray-200 w-36  animate-pulse h-7 rounded-lg" ></div>
                    <div className="bg-gray-200 w-full self-center animate-pulse h-8 rounded-lg" ></div>
                    <div className="bg-gray-200 w-36  animate-pulse h-7 rounded-lg" ></div>
                    <div className="bg-gray-200 w-full self-center animate-pulse h-8 rounded-lg" ></div>
                    <div className="bg-gray-200 w-36  animate-pulse h-7 rounded-lg" ></div>
                    <div className="bg-gray-200 w-full self-center animate-pulse h-8 rounded-lg" ></div>
                    <div className="bg-gray-200 w-full self-center animate-pulse h-10 rounded-lg" ></div>
                    <div className='flex gap-4'>
                        <div className="bg-gray-200 w-full self-center animate-pulse h-10 rounded-lg" ></div>
                        <div className="bg-gray-200 w-full self-center animate-pulse h-10 rounded-lg" ></div>
                    </div>
                    <div className="bg-gray-200 w-full self-center animate-pulse h-10 rounded-lg" ></div>

                </div>

            </div>
        </div>

    )
}

export default LoaderForUpdateInfo