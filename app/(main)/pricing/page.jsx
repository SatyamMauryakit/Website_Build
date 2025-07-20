'use client';
import PricingModel from '@/components/custom/PricingModel';
import { UserDetailContext } from '@/context/userDetailContext';
import Lookup from '@/data/Lookup';
import React, { useContext } from 'react';

const Pricing = () => {
  const { userDetails } = useContext(UserDetailContext); // ✅ fixed typo

  return (
    <div className=' flex flex-col items-center w-full p-10 md:px-32 lg:px-40'>
      <h2 className='text-5xl font-bold'>Pricing</h2>
      <p className='mt-4 text-gray-400 max-w-xl text-center'>
        {Lookup.PRICING_DESC}
      </p>

      <div className='p-4 border rounded-xl w-full flex justify-between mt-7 items-center bg-[#151515]'>
        <h2 className="text-lg text-white flex items-center gap-2">
  <span className="font-bold text-green-400 text-xl">
    {userDetails?.token ?? 'N/A'}
  </span>
  <span className="text-sm text-gray-300">Token left</span>
</h2>

      
      <div className=''><h2 className='font-medium'>Need More Token?  </h2>
      <p>Upgrade your plan below</p></div>
    </div>
    <PricingModel/>
    </div >
  );
};

export default Pricing;
