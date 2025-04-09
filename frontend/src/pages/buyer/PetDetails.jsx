import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ShoppingCart, MessageCircle, ArrowLeft } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import { enqueueSnackbar } from "notistack";
import API_BASE_URL from "@/config.js";
import Header from "@/components/layout/Header";

const PetDetails = () => {
  const { petId } = useParams();
  const { handleAddToCart } = useContext(CartContext);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const buyerId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/pets/${petId}`);
        setPet(res.data.data);
        setLoading(false);
      } catch (error) {
        setError("An error occurred while fetching pet details.");
        setLoading(false);
      }
    };

    fetchPet();
  }, [petId]);

  return (
    <>
      <Header />
      <div className="container mx-auto max-w-5xl p-6">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back
        </Button>

        {/* Loading State */}
        {loading && (
          <Card className="p-6">
            <Skeleton className="h-64 w-full mb-4" />
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3 mb-2" />
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <Alert.Description>{error}</Alert.Description>
          </Alert>
        )}

        {/* Pet Details */}
        {pet && (
          <Card className="flex flex-col md:flex-row gap-6 p-6 shadow-lg rounded-lg">
            {/* Image Carousel */}
            <div className="w-full md:w-1/2">
              <Carousel className="w-full">
                <CarouselContent>
                  {pet.images.map((image, index) => (
                    <CarouselItem key={index} className="basis-full">
                      <img
                        src={image}
                        alt={pet.name}
                        className="w-full h-80 object-cover rounded-lg shadow-md"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* Pet Info Section */}
            <div className="w-full md:w-1/2">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">{pet.breed}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xl font-bold text-gray-600">₹{pet.price}</p>
                <p className="text-gray-600">{pet.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Breed", value: pet.breed },
                    { label: "Age", value: pet.age },
                    { label: "Color", value: pet.color },
                    { label: "Location", value: pet.location },
                    { label: "Gender", value: pet.gender },
                  ].map((item, index) => (
                    <div key={index}>
                      <p className="font-semibold">{item.label}:</p>
                      <p className="capitalize">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Status */}
                <div className="mt-4">
                  <p className="font-semibold">Status:</p>
                  <Badge className="capitalize" variant="outline">{pet.status}</Badge>
                </div>

                {/* Seller Info */}
                <div className="mt-6 border-t pt-4">
                  <p className="capitalize font-semibold text-lg">Seller: {pet.seller}</p>
                  {pet.sellerId && (
                    <p className="text-yellow-600 text-sm mt-2">
                      Seller Rating: ⭐ {pet.sellerId.rating?.toFixed(1) || "Not rated yet"}
                    </p>
                  )}
                 
                  {buyerId && (
                    <Button
                      size="sm"
                      className="mt-2 flex items-center gap-2"
                      onClick={() =>{
                        navigate(`/shop/chat/${buyerId}/${pet.sellerId._id}`, {
                          state: { seller: pet.seller },
                        })
                      }
                      }
                    >
                      <MessageCircle size={16} /> Contact Seller
                    </Button>
                  )}
                </div>

                {/* Vaccination Info */}
                {pet.vaccinations?.length > 0 && (
                  <div className="mt-6">
                    <p className="font-semibold text-lg">Vaccinations:</p>
                    <ul className="list-disc ml-4 text-sm text-gray-600">
                      {pet.vaccinations.map((vaccine, index) => (
                        <li key={index}>
                          <span className="capitalize font-semibold">
                            {vaccine.vaccineName}
                          </span>
                          : {vaccine.completed ? "Completed" : "Pending"} (Due:{" "}
                          {new Date(vaccine.dueDate).toLocaleDateString()})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Button
                    disabled={pet.status !== "Available"}
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await handleAddToCart({
                          itemType: "Pet",
                          itemId: pet._id,
                          itemTypeRef: "Pet",
                          name: pet.name,
                          category: pet.category,
                          breed: pet.breed,
                          price: pet.price,
                          quantity: 1,
                          image: pet.images[0],
                        });
                        enqueueSnackbar("Pet added to cart!", {
                          variant: "success",
                        });
                      } catch (error) {
                        enqueueSnackbar(error, { variant: "error" });
                      }
                    }}
                    className="flex-1 flex items-center gap-2"
                  >
                    <ShoppingCart size={16} /> Add to Cart
                  </Button>
                  <Button
                    disabled={pet.status !== "Available"}
                    onClick={() =>
                      navigate(`/shop/checkout/${pet._id}?itemType=Pet`)
                    }
                    className="flex-1"
                    variant="destructive"
                  >
                    Buy Now
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default PetDetails;
