import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>
          ABOUT <span className='text-gray-700 font-medium'>US</span>
        </p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md: w-2/4 text-sm text-gray-600'>
          <p>Welcome to Prescipto, your trusted partner in managing your healthcare needs, whether you are booking your first appointment or managing ongoing care, Presciptio is the best platform with 100+ trusted doctors and trusted software to make doctor appointments and managing your health records</p>
          <p>We continously strive to enhance our platform, integrating the latest advancements in the tech field.So, Presciptio is the best platform with 100+ trusted doctors and trusted software to make doctor appointments and managing your health records</p>
          <b className='text-gray-800'>Our Vision</b>
          <p>We, also aim to bridge the gap between patients and doctors by giving best healthcare experience for every user</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US
        </span> </p>
        <div className='flex flex-col md:flex-row mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'><b>Efficiency</b> <p>Stremlined appointment scheduling that fits into your busy lifestyle</p></div>
          <div  className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'><b>Convenience</b> <p>Access to a network of trusted healthcare professionals in your area</p></div>
          <div  className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'><b>Personalisation</b> <p>Tailored recommendations and reminders to help you stay on top of your health</p></div>

        </div>


      </div>
    </div>
  )
}

export default About