import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ViewListIcon,
  ChatIcon,
  LogoutIcon,
  HomeIcon,
} from "@heroicons/react/outline";
import { Store } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/Authcontext";
import Home from "@/pages/seller/Home";
import ChatPage from "../seller/ChatPage";
import ListingPage from "../seller/ListingPage";

export default function Seller() {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-800 shadow-md p-6 flex flex-col fixed top-0 left-0 z-10 text-white">
        <div className="flex-grow">
          {/* Sidebar Header */}
          <div className="flex items-center space-x-2 mb-6">
            <Store className="w-6 h-6" />
            <span className="text-lg font-semibold">
              Seller Dashboard
            </span>
          </div>

          {/* Sidebar Menu */}
          <div className="space-y-4">
            {[
              { tab: "home", icon: HomeIcon, label: "Home" },
              { tab: "sellPets", icon: ViewListIcon, label: "Sell Pets" },
              { tab: "chats", icon: ChatIcon, label: "Chats" },
            ].map(({ tab, icon: Icon, label }) => (
              <Button
                key={tab}
                variant="outline"
                className={`w-full flex justify-start items-center gap-3 py-3 px-4 rounded-lg shadow-sm text-gray-800 font-medium transition-all duration-300 hover:bg-blue-800 hover:text-white
                ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white"}`}
                onClick={() => handleTabChange(tab)}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Logout Button at the Bottom */}
        <div className="mt-auto">
          <Button
            className="w-full flex items-center gap-3 py-3 px-4 rounded-lg shadow-sm bg-red-600 text-white font-medium hover:bg-[#e57373] transition-all duration-300"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            <LogoutIcon className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 ml-64 bg-orange-50 shadow-inner overflow-hidden min-h-screen">
        {activeTab === "home" && <ListingPage />}
        {activeTab === "sellPets" && <Home />}
        {activeTab === "chats" && <ChatPage />}
      </div>
    </div>
  );
}
