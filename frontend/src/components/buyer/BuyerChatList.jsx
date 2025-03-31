import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Inbox } from "lucide-react";
import { Button } from "../ui/button";
import API_BASE_URL from "@/config.js"

const BuyerChatList = () => {
  const [chats, setChats] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/chats/${userId}`)
      .then((res) => res.json())
      .then((data) => setChats(data));
  }, [userId]);

  return (
    <>
      <div className="h-screen p-6 bg-white rounded-lg shadow-md w-3/4 container mx-auto my-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-500 hover:text-blue-700"
        >
          ← Back
        </Button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chats</h2>
        <ul className="space-y-4">
          {chats.length === 0 ? (
            <>
              <div className="flex items-center justify-center space-x-4 py-8 px-6">
                <Inbox className="w-12 h-12 text-gray-500" />
                <h3 className="text-2xl font-semibold text-gray-700">
                  You haven't contacted any Seller yet...
                </h3>
              </div>
            </>
          ) : (
            chats.map((chat, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition-all"
              >
                {/* Avatar and Chat Info */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {chat.sellerName}
                    </p>
                  </div>
                </div>

                {/* Button to navigate to the chat */}
                <button
                  onClick={() =>
                    navigate(`/shop/chat/${chat.buyerId}/${chat.sellerId}`, {
                      state: { seller: chat.sellerName },
                    })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Open Chat
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default BuyerChatList;
