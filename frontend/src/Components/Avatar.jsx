import React from 'react'

const Avatar = ({ className, name = "U" }) => {
    return (
        <div className={`flex items-center justify-center font-medium h-10 w-10 rounded-full ${className}`}>
            {name}
        </div>
    )
}

export default Avatar