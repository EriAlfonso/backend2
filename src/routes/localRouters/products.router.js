import { Router } from 'express';
import productManager from '../../DAO/manager/productManager.js';

const router = Router();

// import de product manager
const productManagerImport = new productManager('../product.json');

// PRODUCT
// get con soporte para ?limit=
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const productresult = await productManagerImport.getProducts(limit);
    if (productresult.success) {
      res.json(productresult.products);
    } else {
      res.status(404).send("Product List Not Found")
    }
  } catch (error) {
  console.error("Error:", error);
  res.status(500).json({ error: "Error Receiving Data" });
  }
});


// get con product id devuelve producto especifico
router.get("/:pid", async (req, res) => {
  const productId = parseInt(req.params.pid);
  try {
    const product = await productManagerImport.getProductById(productId);
    if (product.success) {
      res.json(product);
    } else {
      res.status(404).send("Product Not Found");
    }
  } catch (error) {
    res.json("Error Receiving Data");
  }
});

// Post para agregar un producto
router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, category, stock, code } =
    req.body;
  try {
    const productCreated= await productManagerImport.addProduct(
      title,
      description,
      price,
      thumbnail,
      category,
      stock,
      code
    );
    if (!productCreated.success) {
      return res.status(400).json({ error: productCreated.message });
    }
    return res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Put para modificar un producto usando id
router.put("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);
  const { title, description, price, thumbnail, category, stock, code } =
    req.body;

  try {
    const updatedProduct = await productManagerImport.updateProduct(
      id,
      title,
      description,
      price,
      thumbnail,
      category,
      stock,
      code
    );

    if (updatedProduct.success) {
      res.json({ message: `Product with Id: ${id} has been updated` });
    } else {
      res.status(404).json({ error: `Product with ID: ${id} not found` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete para borrar un producto usando id
router.delete("/:pid", async (req, res) => {
  const id = parseInt(req.params.pid);

  try {
    const productDelete = await productManagerImport.deleteProduct(id);

    if (productDelete.success) {
      return res.json({ message: `Product with Id: ${id} has been deleted` });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;