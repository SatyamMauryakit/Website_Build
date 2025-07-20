'use client'
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/userDetailContext';
import { api } from '@/convex/_generated/api';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { useSidebar } from '../ui/sidebar';

export const countToken = (inputText) => {
    if (!inputText) return 0;
    return inputText.trim().split(/\s+/).filter(word => word).length;
};

const Chatview = () => {
    const { id } = useParams();
    const convex = useConvex();
    const { messages, setMessages } = useContext(MessagesContext);
    const { userDetails, setUserDetails } = useContext(UserDetailContext);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    
    // Refs to prevent stale closures in useEffect
    const messagesRef = useRef(messages);
    messagesRef.current = messages;

    const userDetailsRef = useRef(userDetails);
    userDetailsRef.current = userDetails;
    
    const UpdateMassages = useMutation(api.workSpace.UpdateMassages);
    const UpdateTokens = useMutation(api.users.UpdateToken);
    const {toggleSidebar}=useSidebar();

    // Effect to fetch initial data
    useEffect(() => {
        if (id) {
            const getWorkspaceData = async () => {
                const result = await convex.query(api.workSpace.GetWorkspace, { workspaceId: id });
                setMessages(Array.isArray(result?.messages) ? result.messages : []);
            };
            getWorkspaceData();
        }
    }, [id, convex]); // ✅ convex should be a dependency

    // Effect to trigger AI response when user sends a message
    useEffect(() => {
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        if (lastMessage?.role === 'user') {
            getAiResponse();
        }
    }, [messages]); // ✅ This dependency is correct

    const getAiResponse = async () => {
        setLoading(true);
        try {
            const PROMPT = JSON.stringify(messagesRef.current) + Prompt.CHAT_PROMPT;
            const response = await axios.post('/api/ai-chat', { prompt: PROMPT });
            
            const aiResponse = { role: 'ai', content: response.data.result };
            
            // FIX: Create the new array once to avoid race conditions
            const updatedMessagesWithAi = [...messagesRef.current, aiResponse];

            setMessages(updatedMessagesWithAi);

            // FIX: Use the new, correct array for the database update
            await UpdateMassages({
                workspaceId: id,
                messages: updatedMessagesWithAi,
            });

            const tokensUsed = countToken(JSON.stringify(aiResponse));
            const newTotalTokens = Number(userDetailsRef.current?.token) - tokensUsed;

            setUserDetails(prev => ({ ...prev, token: newTotalTokens }));

            await UpdateTokens({
                userId: userDetailsRef.current?._id,
                token: newTotalTokens,
            });
            // You might want to update the userDetails context here as well
            // setUserDetails(prev => ({ ...prev, token: newTotalTokens }));

        } catch (error) {
            console.error("Failed to get AI response or update data:", error);
            // Optionally, add an error message to the chat
        } finally {
            // FIX: Ensure loading is always turned off
            setLoading(false);
        }
    };

    const onGenerate = async (input) => {
        if(userDetails?.token<1000){
toast('You have low tokens, please upgrade your plan');
        }
        if (!input.trim() || loading) return; // Prevent empty submissions or sending while loading

        const userMessage = { role: 'user', content: input };
        
        // FIX: Create the new array with the user's message
        const updatedMessagesWithUser = [...messages, userMessage];

        // Update UI immediately for a responsive feel
        setMessages(updatedMessagesWithUser);
        setUserInput('');

        try {
            // FIX: Save the user's message to the database immediately
            await UpdateMassages({
                workspaceId: id,
                messages: updatedMessagesWithUser,
            });
        } catch (error) {
            console.error("Failed to save user message:", error);
            // Optionally, revert the UI state or show an error
        }
    };

    return (
        <div className='relative h-[85vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll pl-5'>
                {Array.isArray(messages) && messages.map((message, index) => (
                    <div key={index} className='bg-[#272727] p-3 rounded-lg mb-2 flex items-start gap-2 leading-7'>
                        {message?.role === 'user' && userDetails?.picture && (
                            <Image src={userDetails.picture} alt='user img' width={35} height={35} className='rounded-full' />
                        )}
                        <div className='flex flex-col'>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div key="loading" className='p-3 rounded-lg mb-2 flex items-start gap-2'>
                        <Loader2Icon className='animate-spin' />
                        <h2>Generating Response...</h2>
                    </div>
                )}
            </div>

            {/* input section */} 
            <div className='flex gap-2 items-end'>
                {userDetails && <Image src={userDetails?.picture} alt='user img' width={30} height={30} className='rounded-full coursor-pointer' onClick={toggleSidebar} />}
            <div className='p-5 rounded-xl max-w-xl w-full border mt-3 bg-[#151515]'>
                <div className='flex gap-2'>
                    <textarea
                        value={userInput}
                        className='w-full h-32 outline-none bg-transparent max-h-56 resize-none'
                        placeholder={loading ? "Waiting for response..." : Lookup.INPUT_PLACEHOLDER}
                        onChange={(e) => setUserInput(e.target.value)}
                        disabled={loading} // FIX: Disable input while loading
                    />
                    {userInput && !loading && (
                        <ArrowRight
                            onClick={() => onGenerate(userInput)}
                            className='w-10 h-10 bg-blue-500 rounded-md cursor-pointer p-2'
                        />
                    )}
                </div>
                <div>
                    <Link className='h-5 w-5' />
                </div>
            </div>
        </div>
        </div>
    );
};

export default Chatview;