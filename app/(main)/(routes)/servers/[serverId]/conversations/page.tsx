"use client"
import React, { useState } from 'react';
import { ChatHeader } from '@/components/chat/chat-header';
import { ChatWelcome } from '@/components/chat/chat-welcome';
import { UserButton } from '@clerk/nextjs';
import imageUrl from "../../../../../../public/ai.png";
import sendLogo from "../../../../../../public/send.png";
import Image from 'next/image';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

type messageData = Array<{ message: string; sent: boolean;messageId:string }> | [];

function page({ children }: { children: React.ReactNode }) {

  const [message,setMessage] = useState<string>("");
  const [messageList, setMessageList] = useState<messageData>([]);
  const [isDisable,setisDisable] = useState<boolean>(false);

  const formHandler = async () => {
    setisDisable(true);
    setMessageList((prev) => {
      if (prev.length > 0) {
          return [...prev, { message, sent: true,messageId:uuid() }];
      }
      return [{ message, sent: true,messageId:uuid() }];
    });
    

    const data = {
      "contents":[{"parts":[{"text":message}]}]
    };

    setMessage("");

    const response = await axios.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBp34TguXuOFSSIqW9v0cuZQkigpI1PV5Y",data,{
      headers:{
        "Content-Type":"application.json"
      }
    });
    if(response.data)
    {
      let message = response?.data?.candidates[0]?.content.parts[0]?.text;
      message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      message = message.replace(/\n/g, '<br/>');
      setMessageList((prev) => {
        if (prev.length > 0) {
            return [...prev, { message, sent: false,messageId:uuid() }];
        }
        return [{ message, sent: false,messageId:uuid() }];
      });
      setisDisable(false);
    }
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
        <ChatHeader
        name={"Meta AI"}
        serverId={"dhhdhd"}
        type='conversation'
        />
        
        <div className='flex-1 flex flex-col py-4 overflow-y-auto scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-600 scrollbar-w-[7px]'>
          <div className='flex flex-col-reverse mt-auto '>
            <ChatWelcome type={"conversation"} name={"Meta AI"} />
          </div>

          <div>
            {messageList.length > 0 && messageList.map((messageDetails)=>{
              if(messageDetails.sent)
              {
                return (
                <div key={messageDetails.messageId} className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
                  <div className='group flex gap-x-2 justify-end w-full '>
    
                    <div className='flex flex-col justify-center items-center'>
                      <div className='flex items-center gap-x-2'>
                        <span className='text-lg items-center text-zinc-500 dark:text-zinc-400'>
                          {messageDetails.message}
                        </span>
                      </div>
                    </div> 
    
                    <div
                      className='cursor-pointer hover:drop-shadow-md transition'
                    >
                      <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                          elements: {
                              avatarBox: "h-[48px] w-[48px] rounded-full",
                          }
                      }}
                      />
                    </div>
                  </div>
                </div>
                );
              }
              else
              {
                return (
                    <div key={messageDetails.messageId} className='relative group flex items-center flex-col hover:bg-black/5 p-4 transition w-full'>
                      <div className='group flex gap-x-2 items-start w-full '>
                        <div
                          className='cursor-pointer hover:drop-shadow-md transition'
                        >
                          <Image src={imageUrl} alt='Meta AI' width={30} className='object-cover' /> 
                        </div>
                        <div className='flex flex-col w-full'>
                          <div className='flex items-center gap-x-2'>
                              <div className='flex items-center'>
                                <p
                                  className='font-semibold text-sm hover:underline cursor-pointer'
                                >
                                Meta AI
                              </p>
                            </div>
                          </div>
                        </div>
                    </div>
                    <div className='group flex gap-x-2 items-start w-full'>
                      <span className='text-lg text-zinc-500 dark:text-zinc-400 ms-9' dangerouslySetInnerHTML={{ __html: messageDetails.message }}>
                      </span>
                    </div>
                  </div>
                )
              }
            })}

          </div>
        </div>
        <div className="flex w-full p-4 rounded">
          <input type="text" disabled={isDisable} value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Type your message..." 
                className="flex h-10 w-full rounded-md bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white" />
          <button type='button' disabled={isDisable} onClick={formHandler} className="px-5 ms-3 rounded-full ">
            <Image src={sendLogo} alt='Send Message' width={30} className='object-cover' /> 
          </button>
        </div>
    </div>
  )
}

export default page