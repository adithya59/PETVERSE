import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { Heart, ShoppingCart } from "lucide-react";
import { CartContext } from "@/context/CartContext";
import { enqueueSnackbar } from "notistack";
import API_BASE_URL from "@/config.js"

const PetDetails = () => {
  const { petId } = useParams();
  const { handleAddToCart } = useContext(CartContext);
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const buyerId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/pets/${petId}`)
      .then((response) => {
        setPet(response.data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("An error occurred while fetching pet details.");
        setLoading(false);
      });
  }, [petId]);

  return (
    <div className="container mx-auto max-w-5xl p-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
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
        <Card className="flex flex-col md:flex-row gap-6 p-6 shadow-lg">
          {/* Image Carousel */}
          <div className="w-full md:w-1/2">
            <Carousel>
              {pet.images.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={pet.name}
                    className="w-full h-80 object-cover rounded-lg shadow-md"
                  />
                </CarouselItem>
              ))}
            </Carousel>
          </div>

          {/* Pet Info Section */}
          <div className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold">
                {pet.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-xl font-bold text-green-500">₹{pet.price}</p>
              <p>{pet.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold">Breed:</p>
                  <p>{pet.breed}</p>
                </div>
                <div>
                  <p className="font-semibold">Age:</p>
                  <p>{pet.age}</p>
                </div>
                <div>
                  <p className="font-semibold">Color:</p>
                  <p>{pet.color}</p>
                </div>
                <div>
                  <p className="font-semibold">Location:</p>
                  <p>{pet.location}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="font-semibold">Status:</p>
                <Badge variant="outline">{pet.status}</Badge>
              </div>

              {/* Seller Info */}
              <div className="mt-6 border-t pt-4">
                <p className="font-semibold text-lg">
                  Seller: {pet.seller} (⭐ 4.5)
                </p>
                {buyerId && (
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() =>
                      navigate(`/shop/chat/${buyerId}/${pet.sellerId}`, {
                        state: { seller: pet.seller },
                      })
                    }
                  >
                    Contact Seller
                  </Button>
                )}
              </div>

              {/* Vaccination Info */}
              {pet.vaccinations?.length > 0 && (
                <div className="mt-6">
                  <p className="font-semibold text-lg">Vaccinations:</p>
                  <ul className="list-disc ml-4">
                    {pet.vaccinations.map((vaccine, index) => (
                      <li key={index}>
                        <span className="font-semibold">
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
              <div className="mt-6 flex gap-4">
                <Button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await handleAddToCart({
                        itemType: "Pet",
                        itemId: pet._id,
                        itemTypeRef: "Pet",
                        name: pet.name,
                        price: pet.price,
                        quantity: 1, // Ensure pets have quantity 1
                        image: pet.images[0],
                      });
                      enqueueSnackbar("Pet added to cart!", {
                        variant: "success",
                      });
                    } catch (error) {
                      enqueueSnackbar(error, {
                        variant: "error",
                      });
                    }
                  }}
                  className="flex-1"
                >
                  Add to Cart <ShoppingCart className="ml-2" size={16} />
                </Button>
                <Button className="flex-1" variant="destructive">
                  Buy Now
                </Button>
                <Button variant="ghost" className="text-red-500">
                  <Heart size={20} />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      )}
    </div>
  );
};

export default PetDetails;
