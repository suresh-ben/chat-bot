"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function MessageBox({ handleSend, isBotTyping }: { handleSend: (message: string) => void, isBotTyping: boolean }) {

    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // set to scroll height
        }
    }, [content]);

    const handleMessageSending = () => {
        setContent("");
        handleSend(content);
    }

    return (
        <div className="bg-[#404045] p-3 rounded-4xl w-[90%]">
            <textarea
                ref={textareaRef}
                rows={1}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full outline-none resize-none overflow-hidden mb-1 p-2"
                placeholder="Message Chatbot"
                disabled={isBotTyping}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault(); // prevent newline
                        handleMessageSending(); // send the message
                    }
                }}
            />

            <div className="flex justify-end">
                <button
                    onClick={handleMessageSending}
                    className={`w-[2rem] aspect-square relative rounded-full ${
                        content ? "bg-[#4C6BFE]" : "bg-[#71717A]"
                    }`}
                >
                    <Image
                        src={content ? "/arrow_white.png" : "/arrow.png"}
                        alt="Send"
                        fill
                        className="p-1 -rotate-90"
                    />
                </button>
            </div>
        </div>
    );
}
