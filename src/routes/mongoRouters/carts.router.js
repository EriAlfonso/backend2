import { Router } from "express";
import cartManager from "../../DAO/mongoManagers/cartManagerDB.js";
import productManager from "../../DAO/mongoManagers/productManagerDB.js";
import mongoose from "mongoose";

const router = Router();

const cartManagerImport = new cartManager();
const productManagerImport = new productManager();

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    
    const cart = await cartManagerImport.getCartByIdAndPopulate(cid)
    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManagerImport.createCart();
    res.status(200).json("A new cart was created");
  } catch (err) {
    res.status(400).json({ error400: "Error creating cart" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const quantity = req.body.quantity || 1;
  try {
    const cart = await cartManagerImport.getCartById(cid);
    const product = await productManagerImport.getProductById(pid);
    const productIndex = cart.products.findIndex((el) => el._id.toString() === pid);
    if (productIndex === -1) {
      const newProduct = {
        _id: product._id,
        quantity: quantity,
      };
      cart.products.push(newProduct);
    } else {
      cart.products[productIndex].quantity += quantity;
    }
    await cartManagerImport.updateCart(cid, cart.products);
    res.status(200).json("Product added or quantity updated");
  } catch (err) {
    if (err.message.includes("Cart with id")) {
      res.status(404).json({ error404: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});


router.put("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const result = await cartManagerImport.updateCartArray(cid);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  if (!quantity ) {
    return res.status(400).json({ error: "Quantity must be a valid number" });
  }

  try {
    const cart = await cartManagerImport.getCartById(cid);
    const productIndex = cart.products.findIndex((product) => product._id.toString() === pid);
    if (productIndex === -1) {
      res.status(404).json({ error: "Product not found in cart" });
    } else {
      cart.products[productIndex].quantity = quantity;
      await cartManagerImport.updateCart(cid, cart.products);
      res.status(200).json("Product quantity updated");
    }
  } catch (error) {
    if (error.message.includes("Cart with id")) {
      res.status(404).json({ error404: error.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

  router.delete("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
      const result = await cartManagerImport.removeAllProductsFromCart(cid);
      res.status(200).json({ message: result });
    } catch (err) {
      if (err.message.includes("Cart with id")) {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });
  
  router.delete("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
      await cartManagerImport.removeProductFromCart(cid, pid);
  
      res.status(200).json({ message: "Product removed from cart" });
    } catch (err) {
      if (err.message.includes("Product not found in cart")) {
        res.status(404).json({ error: err.message });
      } else if (err.message.includes("Cart with id")) {
        res.status(404).json({ error: err.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });




export default router;
