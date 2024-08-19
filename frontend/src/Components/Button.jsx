import React from 'react'
import { Link } from 'react-router-dom'
const Button = ({ disable, btnText, onClick }) => {

    return (
        <div className='mt-4'>
            <Link>
                <button disabled={disable}
                    onClick={onClick}
                    className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 ${disable ? "bg-gray-300 hover:bg-gray-400 dark:bg-gray-300 dark:hover:bg-gray-400 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700"} w-full`}>{btnText}</button>
            </Link>
        </div >
    )
}

export default Button