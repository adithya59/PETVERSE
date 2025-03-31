import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "@/config.js"

const PetDetails = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pets/${id}`).then((res) => setPet(res.data));
  }, [id]);

  const markAsCompleted = async (vaccineName) => {
    try {
      await axios.put(`${API_BASE_URL}/api/pets/${pet._id}/vaccination`, { vaccineName });
      setPet({
        ...pet,
        vaccinations: pet.vaccinations.map((v) =>
          v.vaccineName === vaccineName ? { ...v, completed: true } : v
        ),
      });
    } catch (error) {
      console.error("Error updating vaccination status:", error);
    }
  };

  if (!pet) return <p className="text-center py-20">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <img src={pet.image} alt={pet.name} className="w-80 h-80 object-cover rounded-md" />
      <h1 className="text-4xl font-bold mt-4">{pet.name}</h1>
      <p className="text-gray-600 mt-2">Breed: {pet.breed}</p>
      <p className="text-gray-600 mt-2">Type: {pet.type}</p>
      <p className="text-gray-600 mt-2">Age: {pet.age} years</p>
      <p className="mt-4">{pet.description}</p>

      {["dog", "cat"].includes(pet.type) ? (
        <>
          <h3 className="text-xl font-semibold mt-6">Vaccination Schedule:</h3>
          <ul className="list-disc ml-6">
            {pet.vaccinations.map((vaccine, index) => (
              <li key={index} className={vaccine.completed ? "text-green-600" : "text-red-600"}>
                {vaccine.vaccineName} - Due: {new Date(vaccine.dueDate).toDateString()} 
                {vaccine.completed ? " (Completed)" : (
                  <button
                    onClick={() => markAsCompleted(vaccine.vaccineName)}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Mark as Completed
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-gray-600">No vaccinations required for this pet.</p>
      )}
    </div>
  );
};

export default PetDetails;
