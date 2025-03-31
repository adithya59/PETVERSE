import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { enqueueSnackbar } from "notistack";
import API_BASE_URL from "@/config.js"

const ProductDetails = () => {
  const { productId } = useParams(); // Get productId from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details
    axios
      .get(`${API_BASE_URL}/api/products/${productId}`)
      .then((response) => {
        setProduct(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="container mx-auto p-4 w-3/4">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </Button>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-72 object-cover rounded-lg shadow-md"
          />
        </div>

        <div className="w-full md:w-2/3">
          <h2 className="text-3xl font-semibold">{product.name}</h2>
          <p className="text-lg text-gray-600">{product.category}</p>
          <p className="text-xl font-bold text-green-500 mt-2">
            ₹{product.price}
          </p>

          <p className="mt-4">{product.description}</p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Stock Available:</h3>
            <p>{product.stock} left</p>
          </div>

          <div className="mt-6">
            <Button
              size="sm"
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  await handleAddToCart({
                    itemType: "Product",
                    itemId: product._id,
                    itemTypeRef: "Product",
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    quantity: 1,
                    image: product.images[0],
                  });
                  enqueueSnackbar("Product added to cart!", {
                    variant: "success",
                  });
                } catch (error) {
                  enqueueSnackbar(error.message, { variant: "error" });
                }
              }}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
