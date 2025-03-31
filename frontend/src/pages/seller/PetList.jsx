import axios from "axios";
import React, { useEffect, useState } from "react";
import SellerPetCard from "../../components/layout/SellerPetCard";
import API_BASE_URL from "@/config.js"

const PetList = ({onNavigateToEdit}) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const sellerId = localStorage.getItem("userId")
  const userName = localStorage.getItem("userName")

 useEffect(() => {
   setLoading(true);
   axios
    .get(`${API_BASE_URL}/api/pets`)
    .then((res) => {
      const filteredPets = res.data.data.filter(
        (pet) => String(pet.sellerId) === sellerId 
      );
      setPets(filteredPets);
      setLoading(false);
     })
     .catch((error) => {
       console.log(error);
       setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl mb-3">{userName}'s Active Listings</h2>
      <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {pets.length === 0 ? (
          <h2>There are no Listings currently</h2>
          ) : (
          <SellerPetCard pets={pets} onNavigate={onNavigateToEdit}/>
        )}
      </div>
    </div>
  );
};

export default PetList;
