'use client'
import { UserDetailContext } from '@/context/userDetailContext';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useSidebar } from '../ui/sidebar';

const WorkSpaceHistory = () => {
  const { userDetails } = useContext(UserDetailContext);
  const convex = useConvex();
  const [workspaces, setWorkspaces] = useState([]);
  const {toggleSidebar}=useSidebar()
  useEffect(() => {
    if (userDetails?._id) {
      GetAllWorkspace();
    }
  }, [userDetails]);

  const GetAllWorkspace = async () => {
    try {
      const result = await convex.query(api.workSpace.GetAllWorkspace, {
        userId: userDetails?._id,
      });
      
      setWorkspaces(result);
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    }
  };

  return (
    <div>
      <h2 className='font-medium text-lg mb-2'
      >Your Chats</h2>
      {workspaces.length === 0 ? (
        <p className="text-sm text-muted-foreground">No chats found.</p>
      ) : (
        <div className="space-y-4">
          {[...workspaces].reverse().map((ws, index) => (
            <div 
  key={index}
  className="
    flex items-center p-1 rounded-md cursor-pointer
    text-gray-400 hover:bg-gray-700 hover:text-white
    transition-colors duration-200"
>
    <Link href={`/workspace/${ws._id}`} className="mr-2">
  <h2 className='text-sm font-light truncate font-serif cursor-pointer' onClick={toggleSidebar}>
    {ws.messages[0]?.content}
  </h2></Link>
</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkSpaceHistory;
