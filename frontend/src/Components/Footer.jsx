import React from 'react'
import { Link } from 'react-router-dom'
const Footer = ({ text, toLink, toText }) => {
    return (
        <div className='flex gap-1 pb-4 justify-center font-normal'>
            <p className='text-sm'>
                {text}
            </p>
            <Link className='text-sm underline font-semibold' to={toLink}>{toText}</Link>
        </div >
    )
}

export default Footer