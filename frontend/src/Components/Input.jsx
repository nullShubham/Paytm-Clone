import React from 'react'
export const Input = ({ id, label, placeholder, type, onChange }) => {
    return (
        <>
            <label className="mt-2 text-base font-medium" htmlFor={id}>{label}</label>
            <input onChange={onChange} className="border text-sm leading-none outline-none placeholder:text-sm p-2 rounded-lg" type={type} id={id} placeholder={placeholder} required />
        </>
    )
}