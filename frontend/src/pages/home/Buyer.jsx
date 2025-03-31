import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import axios from "axios";
import CarouselList from "@/components/buyer/CarouselList";
import Section from "@/components/buyer/Section";
import { Dog, CatIcon, Bird, Bone, Scissors, Shapes, Search } from "lucide-react";
import API_BASE_URL from "@/config.js"

const Buyer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pets from backend API
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/pets/`)
      .then((res) => {
        setPets(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Filter pets based on the search query
  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const petCategoriesWithIcon = [
    { id: "dog", label: "Dogs", icon: Dog },
    { id: "cat", label: "Cats", icon: CatIcon },
    { id: "bird", label: "Birds", icon: Bird },
    { id: "", label: "Browse All", icon: Search }
  ];

  const productsCategoriesWithIcon = [
    { id: "food", label: "Pet Food", icon: Bone },
    { id: "grooming", label: "Grooming", icon: Scissors },
    { id: "toys", label: "Toys", icon: Shapes },
    { id: "", label: "Browse All", icon: Search }
  ];

  function handlePetNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/pets/${currentFilter.category}`);
  }

  function handleProductNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/products/${currentFilter.category}`);
  }

  return (
    <>
      <Header />
      <CarouselList />
      <section className="py-12 bg-orange-400 text-white">
        <div className="container mx-auto px-14">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop Pets by Category
          </h2>
          <Section
            categoriesWithIcon={petCategoriesWithIcon}
            handleNavigateToListingPage={handlePetNavigateToListingPage}
          />
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-14">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop Products by Category
          </h2>
          <Section
            categoriesWithIcon={productsCategoriesWithIcon}
            handleNavigateToListingPage={handleProductNavigateToListingPage}
          />
        </div>
      </section>

      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <div className="bg-orange-500 text-white py-14 text-center">
          <h1 className="text-4xl font-bold">
            Find Your Perfect Pet Companion
          </h1>
          <p className="mt-3 text-lg">
            Adopt or buy pets from verified sellers near you.
          </p>
          <button className="mt-4 bg-white text-orange-500 font-semibold py-2 px-6 rounded-full">
            Explore Now
          </button>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mt-6 px-4">
          <input
            type="text"
            placeholder="Search for pets..."
            className="w-full p-3 border rounded-lg shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Trending Pets Section */}
        <div className="max-w-6xl mx-auto py-10">
          <h2 className="text-3xl font-bold text-center mb-6">Trending Pets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <div
                  key={pet._id}
                  className="bg-white p-4 shadow-lg rounded-lg text-center"
                >
                  <img
                    src={pet.images[0]}
                    alt={pet.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-xl font-semibold">{pet.name}</h2>
                  <p className="text-gray-600">{pet.breed}</p>
                  <p className="text-gray-500 mt-2">{pet.description}</p>
                  <button
                    className="mt-4 bg-orange-500 text-white py-2 px-6 rounded-full shadow-md hover:bg-orange-600"
                    onClick={() => navigate(`/checkout/${pet._id}`)}
                  >
                    Buy Now
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 text-gray-500">
                No pets found matching your search.
              </p>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-orange-500 text-white text-center py-10">
          <h2 className="text-3xl font-bold">Join Our Community</h2>
          <p className="mt-2">
            Find the perfect pet or help pets find loving homes.
          </p>
          <button className="mt-4 bg-white text-orange-500 font-semibold py-2 px-6 rounded-full">
            Get Started
          </button>
        </div>
      </div>
    </>
  );
};

export default Buyer;
