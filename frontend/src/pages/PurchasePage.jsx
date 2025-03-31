import { useParams } from "react-router-dom";
// import ChatComponent from "../components/ChatComponent";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "@/context/Authcontext"; // Import authentication context
import API_BASE_URL from "@/config";

const PurchasePage = () => {
    const { petId } = useParams();  // Get petId from URL
    const { user } = useContext(AuthContext); // Get authenticated user
    const [petDetails, setPetDetails] = useState(null);
    const [sellerId, setSellerId] = useState(""); 
    const [transactionId, setTransactionId] = useState("");

    useEffect(() => {
        if (!user) return; // Ensure user is authenticated before fetching details

        // Fetch pet details from backend
        fetch(`${API_BASE_URL}/api/pets/${petId}`)
            .then((res) => res.json())
            .then((data) => {
                setPetDetails(data);
                setSellerId(data.sellerId); 
                setTransactionId(`txn_${user.id}_${data.sellerId}_${petId}`); // Unique chat room ID
            })
            .catch((err) => console.error("Error fetching pet details:", err));
    }, [petId, user]);

    if (!user) {
        return <p className="text-red-500">You must be logged in to view this page.</p>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
            {petDetails ? (
                <>
                    <h1 className="text-2xl font-bold">{petDetails.name}</h1>
                    <img src={petDetails.image} alt={petDetails.name} className="w-64 h-64 rounded-lg mt-4" />
                    <p className="mt-2 text-lg">Breed: {petDetails.breed}</p>
                    <p className="text-lg">Age: {petDetails.age} years</p>
                    <p className="text-lg">Color: {petDetails.color}</p>

                    {/* Live Chat Component */}
                    <div className="mt-6">
                        <ChatComponent transactionId={transactionId} buyerId={user.id} sellerId={sellerId} />
                    </div>
                </>
            ) : (
                <p>Loading pet details...</p>
            )}
        </div>
    );
};

export default PurchasePage;
