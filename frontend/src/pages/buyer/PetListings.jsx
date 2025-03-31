import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PetCard from "@/components/layout/BuyerPetCard";
import Header from "@/components/layout/Header";
import axios from "axios";
import API_BASE_URL from "@/config.js"

const PetListing = () => {
  const { category } = useParams();
  const [pets, setPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Fetch pets data based on category when it changes
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/pets/`)
      .then((res) => {
        const filteredPets = category
          ? res.data.data.filter((pet) => String(pet.category) === category)
          : res.data.data;
        setPets(filteredPets);
        setFilteredPets(filteredPets);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [category]);

  // Filter pets based on the search query
  useEffect(() => {
    if (searchQuery) {
      const results = pets.filter((pet) =>
        pet.breed.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPets(results);
    } else {
      setFilteredPets(pets);
    }
  }, [searchQuery, pets]);

  // Handle category selection and navigate
  const handleCategoryClick = (categoryName) => {
    navigate(`/shop/pets/${categoryName}`);
  };

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 w-3/4">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search for pets..."
            className="w-full p-3 border rounded-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => handleCategoryClick("")}
              >
                All
              </li>
              <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => handleCategoryClick("dog")}
              >
                Dogs
              </li>
              <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => handleCategoryClick("cat")}
              >
                Cats
              </li>
              <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => handleCategoryClick("bird")}
              >
                Birds
              </li>
              <li
                className="cursor-pointer hover:bg-gray-200 p-2 rounded"
                onClick={() => handleCategoryClick("other")}
              >
                Other
              </li>
            </ul>
          </div>

          {/* Pet Listings */}
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              <p>Loading pets...</p>
            ) : (
                <PetCard pets={filteredPets} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PetListing;
