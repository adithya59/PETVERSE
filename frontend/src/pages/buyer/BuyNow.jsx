import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import API_BASE_URL from "@/config";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

const BuyNow = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const itemId = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemType = queryParams.get("itemType");

  const handleSubmit = async (e) => {
    e.preventDefault();

     if (
          !userId ||
          !name ||
          !lastName ||
          !phone ||
          !paymentMethod 
        ) {
          return enqueueSnackbar("All Fields are required.", {
            variant: "error",
          });
        }
         if (/\d/.test(name) || /\d/.test(lastName)) {
              return enqueueSnackbar("Name should not contain numbers!", {variant: "error"});
            }
        
            if (pincode.length !== 6) {
              return enqueueSnackbar("Enter a valid 6 digit pincode.", {
                variant: "error",
              });
            }
            if (phone.length !== 10) {
              return enqueueSnackbar("Enter a valid 10 digit phone number.", {
                variant: "error",
              });
            }
            const fullAddress = `${address1}, ${address2}, ${city}, ${state}, ${pincode}`;
 
    try {
      const orderResponse = await axios.post(
        `${API_BASE_URL}/api/orders/placeOrder`,
        {
          userId,
          name: `${name} ${lastName}`,
          phone,
          address: fullAddress,
          paymentMethod,
          itemId: itemId.itemId,
          itemType, // or "Product"
          quantity: 1, // Only required for products
        }
      );
      enqueueSnackbar("Order placed successfully!", { variant: "success" });

      navigate(`/shop/order-success/${orderResponse.data.order._id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto py-8">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          ← Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Enter delivery details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col space-y-2">
                <Label>First  Name</Label>
                <Input
                  placeholder="First name"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Last Name</Label>
                <Input
                  placeholder="Last name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Phone Number</Label>
                <div className="flex items-center border border-input rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 py-2 text-gray-700 bg-gray-100 font-medium border-r border-gray-300 select-none text-sm">
                    +91
                  </span>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    maxLength={10}
                    className="flex-1 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      e.target.value = value.slice(0, 10);
                      setPhone(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Flat, House no., Building, Company, Apartment</Label>
                <Input
                  placeholder="e.g. 123, ABC Apartments"
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Area, Street, Sector, Village</Label>
                <Input
                  placeholder="e.g. MG Road, Sector 12"
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Pincode</Label>
                <Input
                  type="text"
                  placeholder="6-digit pincode"
                  maxLength={6}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                    e.target.value = value.slice(0, 6); // Limit input to 6 digits
                    setPincode(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Town/City</Label>
                <Input
                  placeholder="Enter town or city"
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label>State</Label>
                <Input
                  placeholder="Enter state"
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="my-6">
          <CardHeader>
            <CardTitle>Select Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup onValueChange={setPaymentMethod} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {[
                  { value: "COD", label: "Cash on Delivery (COD)" },
                  { value: "Credit/Debit Card", label: "Credit/Debit Card" },
                  { value: "Net Banking", label: "Net Banking" },
                  { value: "UPI", label: "UPI" },
                ].map((option) => (
                  <Label
                    key={option.value}
                    className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                  >
                    <RadioGroupItem value={option.value} className="mr-2" />
                    {option.label}
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
        <Button
          type="submit"
          className="mt-1 min-w-full"
          onClick={handleSubmit}
        >
          Place Order
        </Button>
      </div>
    </>
  );
};

export default BuyNow;
