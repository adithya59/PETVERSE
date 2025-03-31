import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import API_BASE_URL from "@/config.js"

const ImageUploader = ({ onUpload }) => {
  const [images, setImages] = useState([]);
  // const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setImages([...e.target.files]); // ✅ Store selected images
  };

  const handleUpload = async () => {
    if (images.length === 0) return enqueueSnackbar("Please select images.", {variant:"warning"})

    setLoading(true);
    const uploadedUrls = [];
    const formData = new FormData();

    images.forEach((image) => formData.append("images", image));

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.imageUrls) {
        onUpload(res.data.imageUrls); // ✅ Make sure it's an array
      }

      enqueueSnackbar("Image Upload Successful!", {variant:"success"})
    } catch (error) {
      console.error("Error uploading image:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex">
      <Input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
      <Button
        className="mx-2"
        variant="outline"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Images"}
      </Button>
    </div>
  );
};

export default ImageUploader;
