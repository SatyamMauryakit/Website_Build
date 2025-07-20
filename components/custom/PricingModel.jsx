import Lookup from '@/data/Lookup'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { UserDetailContext } from '@/context/userDetailContext'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

const PricingModel = () => {
  const {userDetails, setUserDetails} = useContext(UserDetailContext);
  const UpdateToken = useMutation(api.users.UpdateToken);

  const [selectedOption, setSelectedOption] = useState();
 
 
  const onPaymentSuccess = async() => {
    const updatedTokens = userDetails.tokens + Number(selectedOption?.value);
 
    await UpdateToken({userId:userDetails._id,token:updatedTokens});

  
    
  }
  return (
    <div className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div key={index} className='p-7 border rounded-xl shadow-sm flex flex-col gap-3'>
      
          <h2 className='font-bold text-2xl mb-2'>{pricing.name}</h2> 
          <p className='mt-2 text-blue-600 font-semibold'>${pricing.tokens} Tokens</p>
          <p className='text-gray-400'>{pricing.desc}</p>
          <h2 className='font-bold text-2xl mt-6 text-center'>${pricing.price}</h2>
          {/* <Button>{pricing.name}</Button> */}
                      <PayPalButtons
                       onClick={() =>{  setSelectedOption(pricing)}}

                      disabled={!userDetails}
                      style={{ layout: "horizontal", tagline: false  }}
                      onApprove={()=>onPaymentSuccess()}
                      onCancel={()=>console.log(" Payment cancelled")}
                      
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: pricing.price,
                                currency_code: "USD",
                              },
                            },
                          ],
                        })
                      }}/>

        </div>
      ))}
    </div>
  )
}

export default PricingModel
