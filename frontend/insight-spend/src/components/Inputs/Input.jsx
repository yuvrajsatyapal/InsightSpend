import React from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { useState } from 'react';

const Input = ({ value, onChange, placeholder, label, type}) => {

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };


  return (
    <div>
        <label className='text-[13px] text-slate-800'>{label}</label>

        <div className='input-box'>

            <input 
            type={type == 'password' ? showPassword ? 'text' : 'password' : type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
            className='w-full bg-transparent outline-none'
            />

             {
                type === "password" && (

                    <>
                        {
                            showPassword ? (
                                <FaRegEye
                                size={22}
                                className='primary-text cursor-pointer'
                                onClick={(e) => toggleShowPassword()}
                                />
                            ) : (
                                <FaRegEyeSlash
                                size={22}
                                className='text-slate-400 cursor-pointer'
                                onClick={(e) => toggleShowPassword()}
                                />
                            )
                        }
                    </>

                )}
        </div>
    </div>
  )
}

export default Input