'use client';

import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { Button } from '../ui/button';
import { UserDetailContext } from '@/context/userDetailContext';
import { Download, Rocket, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ActionContext } from '@/context/ActionContext';
import SignInDialog from './SignInDialog';

const Header = () => {
  const { userDetails } = useContext(UserDetailContext);
  const { setAction } = useContext(ActionContext);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const onOptionClick = (path) => router.push(path);
  const onLogoClick = () => router.push('/');

  const onActionBtn = (type) => {
    setAction({
      actionType: type,
      timeStamp: Date.now(),
    });
  };

  return (
    <header className="p-4 flex flex-wrap items-center justify-between border-b border-gray-800 bg-[#101010]">
      {/* Logo */}
      <Image
        src="/log.jpg"
        alt="logo"
        width={40}
        height={40}
        className="cursor-pointer"
        onClick={onLogoClick}
      />

      {/* Buttons */}
      {!userDetails?.name ? (
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setOpenDialog(true)}>
  Sign In
</Button>

<SignInDialog
  openDialog={openDialog}
  closeDialog={(value) => setOpenDialog(value)} // or just setOpenDialog
/>

          <Button className="bg-[#2ba6ff] text-white" onClick={() => onOptionClick('/get-started')}>
            Get Started
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4 flex-wrap">
          <Button
            className="bg-gray-800 text-white hover:bg-gray-700 transition duration-200 rounded-md px-5 py-2 flex items-center gap-2"
            onClick={() => onActionBtn('export')}
            aria-label="Export"
            title="Export your project"
          >
            <Download size={18} />
            Export
          </Button>

          <Button
            className="bg-blue-600 text-white hover:bg-blue-700 transition duration-200 rounded-md px-5 py-2 flex items-center gap-2"
            onClick={() => onActionBtn('deploy')}
            aria-label="Deploy"
            title="Deploy your project"
          >
            <Rocket size={18} />
            Deploy
          </Button>

          <Button
            className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-xl shadow transition duration-300 flex items-center gap-2"
            onClick={() => onOptionClick('/pricing')}
            aria-label="My Subscription"
            title="View your subscription"
          >
            <Wallet size={18} />
            My Subscription
          </Button>

          {userDetails?.picture && (
            <Image
              src={userDetails.picture}
              alt="User profile"
              width={35}
              height={35}
              className="rounded-full cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onOptionClick('/profile')}
              title="Profile"
            />
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
