import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";
import Pet from "../models/pets.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      name,
      lastname,
      phone,
      address,
      paymentMethod,
      itemId,
      itemType,
      quantity, // Only required for products
    } = req.body;

    if (phone.length !== 10) {
      return res.status(400).json({ message: "Enter a Valid 10 digit Phone number."})
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const buyerEmail = user.email;
    let orderItems = [];
    let totalAmount = 0; // Declare totalAmount here so it can be used later

    if (itemId && itemType) {
      // "Buy Now" flow: Creating an order for a single item
      if (itemType === "Product") {
        const product = await Product.findById(itemId);
        if (!product)
          return res.status(404).json({ message: "Product not found" });
        if (product.stock < quantity)
          return res.status(400).json({ message: "Insufficient stock" });

        orderItems.push({
          itemId,
          name: product.name,
          image: product.images[0],
          itemType: "Product",
          quantity,
          price: product.price,
        });

        totalAmount = product.price * quantity; // Calculate total price for products

        // Reduce stock
        await Product.findByIdAndUpdate(itemId, { $inc: { stock: -quantity } });
        if (product.stock - quantity <= 0) {
          await Product.findByIdAndUpdate(itemId, {
            stock: 0,
            status: "SoldOut",
          });
        }
      } else if (itemType === "Pet") {
        const pet = await Pet.findById(itemId);
        if (!pet) return res.status(404).json({ message: "Pet not found" });
        if (pet.status === "soldout")
          return res.status(400).json({ message: "Pet already sold" });

        orderItems.push({
          itemId,
          itemType: "Pet",
          quantity: 1,
          category: pet.category,
          price: pet.price,
          image: pet.images[0],
          name:  pet.name,
          breed: pet.breed
        });

        totalAmount = pet.price; // Set total price for a pet

        // Mark pet as sold
        await Pet.findByIdAndUpdate(itemId, { buyerEmail, status: "soldout" });
      }
    } else {
      // "Cart Checkout" flow
      const cart = await Cart.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      orderItems = cart.items;
      totalAmount = cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ); // Sum total price

      // Process each item in the cart
      for (const item of cart.items) {
        if (item.itemType === "Product") {
          await Product.findByIdAndUpdate(item.itemId, {
            $inc: { stock: -item.quantity },
          });
          if (item.quantity === 0) {
            await Product.findByIdAndUpdate(item.itemId, {
              stock: 0,
              status: "SoldOut",
            });
          }
        } else if (item.itemType === "Pet") {
          await Pet.findByIdAndUpdate(item.itemId, {
            buyerEmail,
            status: "soldout",
          });
        }
      }

      // Clear the cart
      await Cart.deleteOne({ userId });
    }
    // Create new order
    const order = new Order({
      userId,
      name,
      phone,
      items: orderItems,
      address,
      paymentMethod,
      totalAmount, // Now totalAmount is always defined
    });

    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error });
  }
};

export const getOrders = async (req, res) => {
  try {
    const order = await Order.find();
    if (!order) {
      return res.status(404).json({ message: "No orders made  yet." });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Check if the order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Valid order statuses (Modify as needed)
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error });
  }
};
export const rateSeller = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "delivered") {
      return res.status(403).json({ message: "Rating allowed only after delivery" });
    }

    if (order.isRated) {
      return res.status(400).json({ message: "Order already rated" });
    }

    // Loop through each item and update corresponding seller rating
    for (const item of order.items) {
      if (item.itemType === "Pet") {
        const pet = await Pet.findById(item.itemId);
        if (pet) {
          const seller = await User.findById(pet.sellerId); // sellerId should be in pet model
          if (seller) {
            // update seller rating
            if (seller.totalRatings === 0) {
              seller.rating = rating; // Set the first rating
            } else {
              seller.rating = ((seller.rating * seller.totalRatings) + rating) / (seller.totalRatings + 1);
            }
            seller.totalRatings += 1;
            await seller.save();
          }
        }
      }
    }

    order.rating = rating;
    order.isRated = true;
    await order.save();

    res.status(200).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error submitting rating:", error);
    res.status(500).json({ message: "Error submitting rating", error });
  }
};
