import axios from "@/lib/api";
import Message from "@/config/types/Message";

export const chatWithBot = async (messages: Message[]) => {
    try {
        const res = await axios.post("/chat", { messages });
        return res.data.message;
    } catch (error) {
        console.error(error);
        throw error;
    }
}