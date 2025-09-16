import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* left section */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt itaque dicta, quae placeat minima pariatur assumenda, facere dolor velit dolore iste deleniti numquam error ut eos sint porro optio modi?</p>
            </div>
            {/* center section */}
            <div>
                <p className='text-xl font-medium mb-5'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About</li>
                    <li>Contact Us</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            {/* right section */}
            <div>
                <p className='text-xl font-medium mb-5'> GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+91 9345885363</li>
                    <li>rbsv19@gmail.com</li>
                </ul>
            </div>
        </div>
        <div>
            {/* copyright text */}
            <hr />
            <p className='text-center py-5 text-sm '>Copyright 2025 @ Prescipto - All rights reserved </p>
        </div>
    </div>
  )
}

export default Footer