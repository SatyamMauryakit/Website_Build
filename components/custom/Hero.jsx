'use client';

import Lookup from '@/data/Lookup';
import React, { useState, useContext } from 'react';
import { ArrowRight, Link } from 'lucide-react';
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/userDetailContext';
import SignInDialog from './SignInDialog';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSidebar } from '../ui/sidebar';
import Image from 'next/image';

const Hero = () => {
  const [userInput, setUserInput] = useState('');
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);
  const CreateWorkspace = useMutation(api.workSpace.CreateWorkspace);
  const router = useRouter();
  const { toggleSidebar } = useSidebar();

  const onGenerate = async (input) => {
    if (!userDetails?.name) {
      setOpenDialog(true);
      return;
    }

    if (!userDetails?._id) {
      toast.error('User ID not found. Please try signing in again.');
      return;
    }

    if (userDetails?.token < 1000) {
      toast.warning('You have low tokens, please upgrade your plan.');
      return;
    }

    const msg = {
      role: 'user',
      content: input,
    };

    setMessages(msg);

    try {
      const workspaceId = await CreateWorkspace({
        user: userDetails._id, // ✅ ensure user ID is passed correctly
        messages: [msg],
      });

     
      router.push('/workspace/' + workspaceId);
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast.error('Something went wrong while creating workspace.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 text-center md:ml-96">
      <h2 className="text-4xl font-bold">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 font-medium">{Lookup.HERO_DESC}</p>

      <div className="p-5 rounded-xl max-w-xl w-full border mt-3 bg-[#151515]">
        <div className="flex items-start gap-3">
          {userDetails && (
            <Image
              src={userDetails?.picture}
              alt="user img"
              width={30}
              height={30}
              className="rounded-full cursor-pointer"
              onClick={toggleSidebar}
            />
          )}

          <textarea
            className="w-full h-32 outline-none bg-transparent max-h-56 resize-none"
            placeholder={Lookup.INPUT_PLACEHOLDER}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />

          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="w-10 h-10 bg-blue-500 rounded-md cursor-pointer p-2 mt-1 hover:bg-blue-600 transition"
            />
          )}
        </div>
        <div className="mt-2">
          <Link className="h-5 w-5" />
        </div>
      </div>

      <div className="flex flex-wrap max-w-2xl justify-center gap-2 mt-8">
        {Lookup?.SUGGSTIONS.map((suggestion, index) => (
          <h2
            key={index}
            onClick={() => onGenerate(suggestion)}
            className="p-1 px-3 rounded-full border text-sm text-gray-500 hover:text-white cursor-pointer transition-colors duration-200"
          >
            {suggestion}
          </h2>
        ))}
      </div>

      <SignInDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />
    </div>
  );
};

export default Hero;
