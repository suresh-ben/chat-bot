"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { chatWithBot } from "@/app/actions/chat";
import { toast } from 'react-toastify';
import Message from "@/config/types/Message";
import ReactMarkdown from 'react-markdown';

export default function Chat() {

    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // set to scroll height
        }
    }, [message]);

    const scrollToBottomMessages = () => {
         setTimeout(() => {
            if (messagesContainer.current)
                messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
        }, 500);
    };

    const handleSend = async () => {
        if(!message) return;

        // scroll to bottom
        scrollToBottomMessages();

        const _tempAllMessages = [...allMessages];
        _tempAllMessages.push({ content: message, role: "user", time: new Date().toLocaleTimeString() });
        setAllMessages(_tempAllMessages);
        setMessage("");

        try {
            setIsBotTyping(true);
            
            // remove time from allMessages before sending to bot
            const response = await chatWithBot(_tempAllMessages.map(m => ({ content: m.content, role: m.role })));

            setAllMessages(prevMessages => [...prevMessages, { content: response, role: "assistant", time: new Date().toLocaleTimeString() }]);

            // scroll to bottom
            scrollToBottomMessages();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsBotTyping(false);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center sm:px-[20%] py-5 sm:py-10">
            <AnimatePresence>
                {
                    allMessages.length == 0 && <motion.div 
                        className="flex flex-col w-full px-[15%] gap-2 sm:gap-4 sm:justify-center sm:items-center overflow-hidden mb-6 sm:mb-8"
                    >
                        <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4">
                            <div className="w-[3rem] aspect-square relative">
                                <Image src="/chatbot.png" alt="Chatbot" fill />
                            </div>

                            <p className="font-bold text-lg sm:font-semibold sm:text-2xl">Hi, I&apos;m Chatbot.</p>
                        </div>

                        <p>How can I help you?</p>
                    </motion.div>
                }
            </AnimatePresence>
            <AnimatePresence>
                {
                    allMessages.length > 0 && <motion.div 
                        ref={messagesContainer}
                        className="w-[90%] p-3 pb-[5rem] flex flex-col gap-10 hide-scrollbar"
                        initial={{ flex: 0 }}
                        animate={{ flex: 1 }}
                        exit={{ flex: 0 }}
                    >
                        {
                            allMessages.map((message, index) => {
                                return message.role == "user" ? <UserMessage messgae={message} key={index} /> : <BotMessage scrollToBottomMessages={scrollToBottomMessages} messgae={message} key={index} isNew={index == allMessages.length - 1} />
                            })
                        }

                        {
                            isBotTyping && <div className="flex gap-2 items-center">
                                <div className="w-[2.2rem] aspect-square relative rounded-full border border-gray-500 animate-pulse">
                                    <Image src="/chatbot.png" className="p-[.3rem]" alt="Typing" fill />
                                </div>
                                <p className="text-gray-500">Typing...</p>
                            </div>
                        }
                    </motion.div>
                }
            </AnimatePresence>

            <div className="bg-[#404045] p-3 rounded-4xl w-[90%]">
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full outline-none resize-none overflow-hidden mb-1 p-2"
                    placeholder="Message Chatbot"
                />

                <div className="flex justify-end">
                    <button onClick={handleSend} className={`w-[2rem] aspect-square relative rounded-full ${message? "bg-[#4C6BFE]" : "bg-[#71717A]"}`}>
                        <Image src={message? "/arrow_white.png" : "/arrow.png"} alt="Send" fill className="p-1 -rotate-90" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function UserMessage({ messgae }: { messgae: Message }) {

    const copyMessageToClipboard = () => {
        navigator.clipboard.writeText(messgae.content);
        toast.success("Message copied to clipboard");
    }

    return <div className="w-full flex flex-col justify-end items-end">
        <div className="bg-[#414158] p-2 px-6 rounded-2xl max-w-[85%] sm:max-w-[80%]">
            <p>{messgae.content}</p>
            <div className="flex justify-end mt-1">
                <p className="text-[#71717A] text-[.5rem]">{messgae.time?.slice(0, 5)}</p>
            </div>
        </div>

        <button onClick={copyMessageToClipboard} className="w-[1rem] aspect-square relative ml-2 mt-2">
            <Image 
                src={"/copy.png"}
                alt="Copy"
                fill
            />
        </button>
    </div>
}

function BotMessage({ messgae, isNew, scrollToBottomMessages }: { messgae: Message, isNew: boolean, scrollToBottomMessages: () => void }) {

    // If new render the message in typing animation
    const [content, setContent] = useState(messgae.content);
    useEffect(() => {
        if (isNew) {
            setContent("...");
            
            //add one one letter to content every 100ms from messgae.content
            let contentLength = 0;
            const interval = setInterval(() => {
                setContent(messgae.content.slice(0, contentLength + 1));
                scrollToBottomMessages();

                if (contentLength >= messgae.content.length) clearInterval(interval);
                contentLength = contentLength + 2;
            }, 10);

            return () => clearInterval(interval);
        }
    }, [isNew, messgae.content, scrollToBottomMessages]);

    return <div className="flex gap-2 w-full">
        <div className="w-[2.2rem] h-[2.2rem] relative rounded-full border border-gray-300 hidden sm:block">
            <Image src="/chatbot.png" className="p-[.3rem]" alt="Typing" fill />
        </div>
        <div className="p-2 py-1 flex-1 flex flex-col">
            <div>
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>
            <div className="flex justify-start mt-2">
                <p className="text-[#71717A] text-[.5rem]">{messgae.time?.slice(0, 5)}</p>
            </div>
        </div>
    </div>
}