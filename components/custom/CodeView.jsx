'use client'
import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  
  SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import axios from 'axios';
import { MessagesContext } from '@/context/MessagesContext';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { countToken } from './Chatview';
import { UserDetailContext } from '@/context/userDetailContext';
import SandPackPreviewClient from '@/components/custom/SandPackPreviewClient'
import { ActionContext } from '@/context/ActionContext';


const CodeView = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('code');
    const [files, setFiles] = useState(Lookup?.DEFAULT_FILE || {});
    const { messages, setMessages } = useContext(MessagesContext);
    const { userDetails, setUserDetails } = useContext(UserDetailContext);
    const convex = useConvex();
    const [loading, setLoading] = useState(false);
    
    // ✅ FIX: Use refs to prevent using stale state in async functions
    const userDetailsRef = useRef(userDetails);
    userDetailsRef.current = userDetails;

    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    const UpdateFiles = useMutation(api.workSpace.UpdateFiles);
    const UpdateTokens = useMutation(api.users.UpdateToken);
 

    useEffect(() => {
        id && getFiles();
    }, [id]);

   

    const getFiles = async () => {
        setLoading(true);
        try {
            const result = await convex.query(api.workSpace.GetWorkspace, {
                workspaceId: id
            });
            const mergedFiles = {
                ...Lookup.DEFAULT_FILE,
                ...result?.fileData
            };
            setFiles(mergedFiles);
        } catch (error) {
            console.error("Failed to fetch workspace files:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        if (lastMessage?.role === 'user') {
            generateAiCode();
        }
    }, [messages]);

    const generateAiCode = async () => {
        setLoading(true);
        try {
            // ✅ FIX: Use the ref to ensure you have the latest messages
            const prompt = JSON.stringify(messagesRef.current) + ' ' + Prompt.CODE_GEN_PROMPT;

            const result = await axios.post('/api/gen-ai-code', {
                prompt
            });

            const aiResp = result.data;

            if (!aiResp?.files || typeof aiResp.files !== 'object') {
                
                return;
            }

            const mergedFiles = {
                ...Lookup.DEFAULT_FILE,
                ...aiResp.files
            };

            setFiles(mergedFiles);

            // Update in database (Convex)
            await UpdateFiles({
                workspaceId: id,
                files: mergedFiles
            });

            const tokensUsed = countToken(JSON.stringify(aiResp));
            // ✅ FIX: Use the ref to ensure you have the latest userDetails
            const newTotalTokens = Number(userDetailsRef.current?.token) - tokensUsed;

            await UpdateTokens({
                userId: userDetailsRef.current?._id,
                token: newTotalTokens,
            });
            // You might also want to update the context state
            setUserDetails(prev => ({...prev, token: newTotalTokens}));
        
        } catch (err) {
            console.error('❌ Error generating AI code or updating files:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='relative'>
            <div className="bg-[#181818] w-full p-2 border">
                <div className="flex items-center flex-wrap shrink-0 gap-3 bg-black p-1 w-[140px] justify-center rounded-full">
                    <h2
                        className={`text-sm cursor-pointer ${
                            activeTab === 'code' && 'text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full'
                        }`}
                        onClick={() => setActiveTab('code')}
                    >
                        Code
                    </h2>
                    <h2
                        className={`text-sm cursor-pointer ${
                            activeTab === 'preview' && 'text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full'
                        }`}
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </h2>
                </div>
            </div>

            <SandpackProvider
                // ✅ FIX: Add a key that changes when files are updated to force re-mounting
                key={JSON.stringify(files)} 
                files={files}
                template="react"
                theme="dark"
                customSetup={{
                    dependencies: {
                        ...Lookup.DEPENDANCY
                    }
                }}
                options={{
                    externalResources: ['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4']
                }}
            >
                <SandpackLayout>
                    {activeTab === 'code' ? (
                        <>
                            <SandpackFileExplorer style={{ height: '80vh' }} />
                            <SandpackCodeEditor style={{ height: '80vh'  }} />
                        </>
                    ) : (
                        <SandPackPreviewClient />
                    )}
                </SandpackLayout>
            </SandpackProvider>

            {loading && <div className='p-10 bg-gray-900 opacity-80 absolute top-0 left-0 rounded-lg w-full h-full flex items-center justify-center z-50 gap-4'>
                <Loader2Icon className='animate-spin text-white h-10 w-10' />
                <h2 className='text-white'>Generating your files...</h2>
            </div>}
        </div>
    );
};

export default CodeView;