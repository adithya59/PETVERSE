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
import { Plus } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import ImageUploader from "@/components/ImageUploader";
import { enqueueSnackbar } from "notistack";
import API_BASE_URL from "@/config.js"

const ListProducts = () => {

    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState("")
    const [price, setPrice] = useState("")
    const [images, setImages] = useState([])
    const [description, setDescription] = useState("")

    const handleSubmit = async () => {
        if (images.length === 0) return alert("Please upload at least one image.");
        const productData = {
          name,
          category,
          stock,
          price,
          images,
          description,
        };
        console.log(productData)
        axios
          .post(`${API_BASE_URL}/api/products`, productData)
          .then(() => enqueueSnackbar("Product listed successfully!", {variant:"success"}))
          .catch((error) => {
            enqueueSnackbar(error.message, {variant:"error"});
          });
      };

  return (
    <div className="p-6 space-y-6">
  <h2 className="text-2xl font-semibold mb-4">Sell Products</h2>
  <Card>
    <CardHeader>
      <CardTitle>Sell a Product</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Product Name</label>
          <Input placeholder="Enter Product name" onChange={(e) => setName(e.target.value)} />
        </div>

        {/* Category */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select onValueChange={(value) => setCategory(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="grooming">Grooming</SelectItem>
              <SelectItem value="toys">Toys</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Stock Quantity</label>
          <Input placeholder="Enter stock quantity" type="number" onChange={(e) => setStock(e.target.value)} />
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Price</label>
          <Input placeholder="Enter price" type="number" onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col space-y-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea placeholder="Short description of the product" onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col space-y-2">
          <label className="text-sm font-medium">Upload Images</label>
          <ImageUploader onUpload={(newImages) => setImages((prev) => [...prev, ...newImages])} />
        </div>
      </div>
      <Button className="mt-6 w-full" variant="default" onClick={handleSubmit}>
        <Plus className="mr-2" size={16} /> Add Product
      </Button>
    </CardContent>
  </Card>
</div>

  );
};

export default ListProducts;
