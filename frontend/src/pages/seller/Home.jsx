import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";
import { enqueueSnackbar } from "notistack";
import PetClassifier from "@/components/PetClassifier";
import API_BASE_URL from "@/config.js";

export default function Home() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [ageNumber, setAgeNumber] = useState("");
  const [ageUnit, setAgeUnit] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [isBreedVerified, setIsBreedVerified] = useState(false);
  const [detectedBreed, setDetectedBreed] = useState("");
  const [firstImageUrl, setFirstImageUrl] = useState("");
  const [healthCertImages, setHealthCertImages] = useState([]);
  const [gender, setGender] = useState("");

  useEffect(() => {
    // Check if the entered breed matches the detected breed based on the length of the detected breed
    if (detectedBreed && breed) {
      const breedMatches =
        breed.slice(0, detectedBreed.length).toLowerCase() ===
        detectedBreed.toLowerCase();
      setIsBreedVerified(breedMatches);
    } else if (!detectedBreed) {
      // If no breed was detected, don't block submission
      setIsBreedVerified(false);
    }
  }, [breed, detectedBreed]);

  const handleImageUpload = (newImages) => {
    setImages((prev) => {
      const updatedImages = [...prev, ...newImages];

      // If this is the first image, set it for the breed classifier
      if (updatedImages.length > 0 && !firstImageUrl) {
        setFirstImageUrl(updatedImages[0]);
      }

      return updatedImages;
    });
  };

  const handleBreedDetected = (breed) => {
    setDetectedBreed(breed);

    // If breed field is empty and we detected a breed, auto-fill it
    if (!breed && breed) {
      setBreed(breed);
      setIsBreedVerified(true);
    }
  };

  // Add this to state
  const [vaccinations, setVaccinations] = useState([]);

  // Function to add a new vaccination field
  const addVaccination = () => {
    setVaccinations([...vaccinations, { vaccineName: "", dueDate: "" }]);
  };

  // Function to remove a vaccination field
  const removeVaccination = (index) => {
    setVaccinations(vaccinations.filter((_, i) => i !== index));
  };

  // Function to update vaccination details
  const updateVaccination = (index, field, value) => {
    const updatedVaccinations = [...vaccinations];
    updatedVaccinations[index][field] = value;
    setVaccinations(updatedVaccinations);
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      enqueueSnackbar("Please upload at least one image.", {
        variant: "error",
      });
      return;
    }

    if (!breed.trim()) {
      enqueueSnackbar("The Pet Breed field cannot be empty.", {
        variant: "error",
      });
      return;
    }

    if (!isBreedVerified) {
      enqueueSnackbar("The entered breed doesn't match the detected breed.", {
        variant: "error",
      });
      return;
    }

    if (!gender) {
      enqueueSnackbar("Please select a gender.", { variant: "error" });
      return;
    }

    const finalAge = `${ageNumber} ${
      parseInt(ageNumber) === 1 ? ageUnit.slice(0, -1) : ageUnit
    }`;    

    const sellerId = localStorage.getItem("userId");
    const sellerName = localStorage.getItem("userName");
    const petData = {
      name,
      category,
      breed,
      age: finalAge,
      price,
      color,
      location,
      images: [...images, ...healthCertImages],
      healthCertificate: healthCertImages,
      description,
      status: "Available",
      sellerId: sellerId,
      seller: sellerName,
      vaccinations,
      gender,
    };

    axios
      .post(`${API_BASE_URL}/api/pets`, petData)
      .then(() => {
        enqueueSnackbar("Pet Listed Successfully", { variant: "success" });
        // Reset form
        setName("");
        setCategory("");
        setBreed("");
        setAge("");
        setColor("");
        setLocation("");
        setPrice("");
        setImages([]);
        setHealthCertImages([]);
        setDescription("");
        setFirstImageUrl("");
        setDetectedBreed("");
        setVaccinations([]);
      })
      .catch((error) => {
        enqueueSnackbar(error.message, { variant: "error" });
      });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h2 className="text-2xl mb-4">Sell Pets</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Add New Pet Listing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pet Name</label>
              <Input
                placeholder="Pet Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Category</label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Pet Breed
                {detectedBreed && !isBreedVerified && (
                  <span className="text-red-500 text-xs ml-2">
                    (Doesn't match detected breed: {detectedBreed})
                  </span>
                )}
                {detectedBreed && isBreedVerified && (
                  <span className="text-green-500 text-xs ml-2">
                    (Verified ✓)
                  </span>
                )}
              </label>
              <Input
                placeholder="Pet Breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className={
                  detectedBreed && !isBreedVerified ? "border-red-500" : ""
                }
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Gender</label>
              <Select
                value={gender}
                onValueChange={(value) => setGender(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Age</label>
              <div className="flex gap-2">
                {/* Number Dropdown */}
                <Select onValueChange={(value) => setAgeNumber(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Number" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(12).keys()].map((num) => (
                      <SelectItem key={num + 1} value={(num + 1).toString()}>
                        {num + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Unit Dropdown */}
                <Select onValueChange={(value) => setAgeUnit(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Months">Months</SelectItem>
                    <SelectItem value="Years">Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Color</label>
              <Input
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Location</label>
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Price</label>
              <Input
                placeholder="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Pet Images</label>
              <ImageUploader onUpload={handleImageUpload} />
              {images.length > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  {images.length} image(s) uploaded
                </div>
              )}
              {images.length > 0 && (
                <Button
                  className="mt-2"
                  variant="outline"
                  onClick={() => {
                    setImages([]); // Clear the images
                    setFirstImageUrl(""); // Clear the first image URL
                    enqueueSnackbar("Images cleared successfully.", {
                      variant: "info",
                    });
                  }}
                >
                  Clear Images
                </Button>
              )}
            </div>

            <div className="space-y-2 mt-2">
              <label className="block text-sm font-medium">
                Health Certificate
              </label>
              <ImageUploader
                onUpload={(newImages) =>
                  setHealthCertImages((prev) => [...prev, ...newImages])
                }
              />
              {healthCertImages.length > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  {healthCertImages.length} image(s) uploaded
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              placeholder="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium">
              Vaccination Details
            </label>

            {vaccinations.map((vaccination, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder="Vaccine Name"
                  value={vaccinations.vaccineName}
                  onChange={(e) =>
                    updateVaccination(index, "vaccineName", e.target.value)
                  }
                />
                <Input
                  type="date"
                  value={vaccination.dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    updateVaccination(index, "dueDate", e.target.value)
                  }
                />
                <Button
                  variant="destructive"
                  onClick={() => removeVaccination(index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}

            <Button className="mt-2" variant="outline" onClick={addVaccination}>
              <Plus className="mr-2" size={16} /> Add Vaccination
            </Button>
          </div>

          {firstImageUrl && (
            <div className="mt-6">
              <PetClassifier
                imageUrl={firstImageUrl}
                onBreedDetected={handleBreedDetected}
              />
            </div>
          )}

          <Button
            className="mt-6 w-full"
            variant="default"
            onClick={handleSubmit}
            disabled={
              images.length === 0 ||
              !isBreedVerified ||
              !breed.trim() ||
              !gender
            }
          >
            <Plus className="mr-2" size={16} /> Sell
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
