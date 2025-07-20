"use client"
import React, { useEffect, useState } from 'react'
import {MessagesContext} from '../context/MessagesContext'
import { UserDetailContext } from '../context/userDetailContext'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from '../components/custom/Header'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { useConvex } from 'convex/react'
import { api } from '../convex/_generated/api'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import {AppSidebar} from '../components/custom/AppSidebar'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ActionContext } from '@/context/ActionContext'
import { useRouter } from 'next/navigation'







const Provider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [userDetails, setUserDetails] = useState()
  const [action, setAction] = useState()
  const convex = useConvex()
  const Router = useRouter();

  useEffect(() => {
    IsAuthenticated()
  }, [])

  const IsAuthenticated = async () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")

       if(!storedUser){
        Router.push('/');
        return ;
       }
      if (storedUser) {
        const user = JSON.parse(storedUser)
        setUserDetails(user)

        if (user?.email) {
          try {
            const result = await convex.query(api.users.GetUser, {
              email: user.email,
            })

            setUserDetails(result)
            
          } catch (err) {
           
          }
        } else {
         
        }
      }
    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
      <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        
       }}>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <MessagesContext.Provider value={{ messages, setMessages }}>
          <ActionContext.Provider value={{ action, setAction  }}>
          <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <Header />
            
             
 <SidebarProvider defaultOpen={false}>
  <AppSidebar/>

            {children}
  </SidebarProvider>


           
             
           
          </NextThemesProvider>
          </ActionContext.Provider>
        </MessagesContext.Provider>
      </UserDetailContext.Provider>
      </PayPalScriptProvider>
    </GoogleOAuthProvider>
  )
}

export default Provider
