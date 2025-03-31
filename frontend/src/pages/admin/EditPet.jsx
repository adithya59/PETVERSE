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
import { Edit3 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";
import { enqueueSnackbar } from "notistack";
import { Label } from "@/components/ui/label";
import API_BASE_URL from "@/config.js"

export default function EditPet({ onBack, pet }) { //Iwant this pet inside useEffect
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/pets/${pet}`)
    .then((res) => {
        setId(res.data.data._id)
        setName(res.data.data.name)
        setCategory(res.data.data.category)
        setBreed(res.data.data.breed)
        setColor(res.data.data.color)
        setAge(res.data.data.age)
        setLocation(res.data.data.location)
        setPrice(res.data.data.price)
        setDescription(res.data.data.description)
    })
  }, [pet])

  const handleSave = async () => {
    if (images.length === 0) return alert("Please upload at least one image.");

    const sellerId = localStorage.getItem("userId");
    const sellerName = localStorage.getItem("userName");
    const petData = {
      name,
      category,
      breed,
      age,
      price,
      color,
      location,
      images,
      description,
      status: "Available",
      sellerId: sellerId,
      seller: sellerName,
    };
    axios
      .put(`${API_BASE_URL}/api/pets/${id}`, petData)
      .then(() => enqueueSnackbar("Pet updated successfully!", {variant:"success"}))
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="p-6 space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        ← Back
      </Button>
      {/* Quick Add Pet Form */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Pet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-center">
            <div className="flex flex-col space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Pet Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Category</Label>
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

            <div className="flex flex-col space-y-2">
              <Label>Pet Breed</Label>
              <Input
                placeholder="Pet Breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Age</Label>
              <Input
                placeholder="Age"
                value={age}
                type="string"
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Color</Label>
              <Input
                placeholder="Color"
                value={color}
                type="string"
                onChange={(e) => setColor(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Location"
                value={location}
                type="string"
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Price</Label>
              <Input
                placeholder="Price"
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <Label>Images</Label>
              <ImageUploader
                onUpload={(newImages) =>
                  setImages((prev) => [...prev, ...newImages])
                }
              />
            </div>

            <div className="flex flex-col col-span-2 space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Short Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <Button
            className="mt-6 w-full"
            variant="default"
            onClick={handleSave}
          >
            <Edit3 className="mr-2" size={16} /> Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
