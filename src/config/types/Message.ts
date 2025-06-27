type Message = {
    role: "assistant" | "user";
    content: string;
    time?: string;
}

export default Message