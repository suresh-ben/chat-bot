import Message from "@/config/types/Message";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<NextResponse> {
    try {
        const { messages }: { messages: Message[] } = await req.json();
        console.log(messages, "messages");

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // or hardcode your API key here
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192", // correct model ID for Groq //llama-3.3-70b-versatile
                    messages: messages,
                }),
            }
        );

        const data = await response.json();
        console.log(data.choices[0].message.content, "bot replies??");

        return NextResponse.json({ message: data.choices[0].message.content }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        );
    }
}
