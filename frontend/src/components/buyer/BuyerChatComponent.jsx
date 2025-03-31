import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from "lucide-react"
import API_BASE_URL from "@/config";

const socket = io(API_BASE_URL);

const BuyerChatComponent = () => {
  const { buyerId, sellerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const buyerName = localStorage.getItem("userName");
  const { state } = useLocation();
  const sellerName = state ? state.seller : "Seller";
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.emit("start_chat", { buyerName, sellerName, buyerId, sellerId });

    socket.on("chat_history", (history) => {
      setMessages(history);
      setLoading(false);
    });

    socket.on("receive_message", (newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      socket.off("chat_history");
      socket.off("receive_message");
    };
  }, [buyerId, sellerId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    socket.emit("send_message", { buyerId, sellerId, sender: buyerId, message: input });
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>


      <Card>
        <CardHeader>
          <CardTitle>Chat with {sellerName}</CardTitle>
        </CardHeader>
        <CardContent className="h-96 overflow-y-auto border p-4 flex flex-col">
          {loading ? (
            <Skeleton className="h-6 w-full mb-2" />
          ) : messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === buyerId ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
                }`}
              >
                {msg.message}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          )}
          <div ref={chatEndRef} />
        </CardContent>
        <div className="p-4 border-t flex items-center gap-2">
          <Input
            type="text"
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <Button onClick={sendMessage}><Send /></Button>
        </div>
      </Card>
    </div>
  );
};

export default BuyerChatComponent;
