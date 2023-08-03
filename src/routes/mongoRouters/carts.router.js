import { Router } from "express";
import cartManager from "../../DAO/mongoManagers/cartManagerDB.js";
import productManager from "../../DAO/mongoManagers/productManagerDB.js";

const router = Router();

const cartManagerImport = new cartManager();
const productManagerImport = new productManager();

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

router.get("/:cid", async (req, res) => {
  let { cid } = req.params;

  try {
    const cart = await cartManagerImport.getCartById(cid);
    res.status(200).json(cart);
  } catch (err) {
    if (err.message.includes("Cart with id")) {
      res.status(404).json({ error404: err.message });
    }
  }
});

export default router;
