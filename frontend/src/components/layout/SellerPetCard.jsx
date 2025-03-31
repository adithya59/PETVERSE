import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2, Pencil } from "lucide-react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import API_BASE_URL from "@/config.js"

const SellerPetCard = ({ pets, onNavigate }) => {
  if (!Array.isArray(pets)) return null;
  const navigate = useNavigate();

  const onDelete = (id) => {
    axios
      .delete(`${API_BASE_URL}/api/pets/${id}`)
      .then(() => {
        enqueueSnackbar("Pet removed successfully!", { variant: "success" });
        setTimeout(() => {
          navigate(0);
        }, 1500); 
      })
      .catch((error) => {
        console.log(error);
        enqueueSnackbar("Failed to remove pet!", { variant: "error" });
      });
  };

  return (
    <>
      {pets.map((pet) => {
        return (
          <div
            key={pet._id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <img
              src={pet.images[0]}
              alt={pet.name}
              className="w-full h-48 object-cover cursor-pointer"
            />
            <div className="p-4 cursor-pointer bg-gray-100">
              <h3 className="text-lg font-semibold">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">{pet.breed}</p>
              <div className="flex items-center mt-4 justify-between w-full">
                <span className="text-xl font-bold">₹{pet.price}</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex items-center space-x-1 hover:bg-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(pet._id);
                    }}
                  >
                    <Trash2 />
                  </Button>
                  <Button
                    className="bg-amber-400 flex items-center space-x- hover:bg-yellow-300"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate(pet._id);
                    }}
                  >
                    <Pencil />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default SellerPetCard;
