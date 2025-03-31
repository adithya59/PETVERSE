import { useEffect, useState } from "react";
import { User, Inbox } from "lucide-react";
import API_BASE_URL from "@/config.js"

const SellerChatList = ({ onNavigate }) => {
  const [chats, setChats] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/chats/${userId}`)
      .then((res) => res.json())
      .then((data) => setChats(data))
      .catch((error) => {
        console.error("Error fetching chats:", error);
      });
  }, [userId]);

  return (
    <div className="h-screen flex flex-col p-6 bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Chats</h2>

      {/* Main content container that adapts to available height */}
      <div className="flex-1 overflow-auto">
        <ul className="space-y-4">
          {chats.length === 0 ? (
            <div className="flex items-center justify-center space-x-4 py-8 px-6">
              <Inbox className="w-12 h-12 text-gray-500" />
              <h3 className="text-2xl font-semibold text-gray-700">
                No buyer has contacted you yet.
              </h3>
            </div>
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
                      {chat.buyerName}
                    </p>
                  </div>
                </div>

                {/* Button to navigate to the chat */}
                <button
                  onClick={() => onNavigate(chat)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  Open Chat
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default SellerChatList;
