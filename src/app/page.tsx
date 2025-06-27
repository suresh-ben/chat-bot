import Chat from "@/components/Chat";
import Image from "next/image";
import Link from "next/link";
import { JSX } from "react";

export default function Home(): JSX.Element {
    return <div className="w-screen h-screen flex flex-col sm:flex-row">
        <div className="h-[4rem] sm:h-screen sm:w-[4rem] flex sm:flex-col justify-between items-center px-6 sm:py-6 bg-[#202327]">
            <Link href={"/"} className="w-[2.5rem] aspect-square relative">
                <Image 
                    src="/chatbot.png"
                    alt="Chatbot"
                    fill
                />
            </Link>

            <div className="w-[2.5rem] aspect-square relative bg-gray-600 rounded-full">
                <Image 
                    src="/user.png"
                    alt="User"
                    fill
                />
            </div>
        </div>

        <div className="flex-1 h-[calc(100%-4rem)] sm:h-auto">
            <Chat />
        </div>
    </div>;
}
