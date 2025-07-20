// ✅ SidebarFooter.jsx

'use client';

import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react';
import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { UserDetailContext } from '@/context/userDetailContext'; // ✅ added

export const SideBarFooter = () => {
  const router = useRouter();
  const { setUserDetails } = useContext(UserDetailContext); // ✅ get context

  const options = [
    {
      name: 'Settings',
      icon: Settings,
      path: '/',
    },
    {
      name: 'Help Center',
      icon: HelpCircle,
      path: '/',
    },
    {
      name: 'My Subscription',
      icon: Wallet,
      path: '/pricing',
    },
    {
      name: 'Sign Out',
      icon: LogOut,
      action: 'logout', // ✅ special action for logout
    },
  ];

  const onOptionClick = (option) => {
    if (option.action === 'logout') {
      handleLogout();
    } else if (option.path) {
      router.push(option.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserDetails(null);
    router.push('/');
  };

  return (
    <div className="p-2 mb-10">
      {options.map((option, index) => (
        <Button
          key={index}
          className="w-full flex justify-start my-3 gap-2"
          variant={'ghost'}
          onClick={() => onOptionClick(option)}
        >
          <option.icon />
          {option.name}
        </Button>
      ))}
    </div>
  );
};
