import { Router } from 'express';
import productManager from '../../DAO/mongoManagers/productManagerDB.js';
import productModel from '../../DAO/models/products.model.js';

const router = Router();

const productManagerImport = new productManager();

router.post("/", async (req, res) => {
  const { title, description, price, code, stock, category, thumbnail } = req.body;

  if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await productManagerImport.addProduct(title, description, price, thumbnail, category, stock, code);

    if (result.success) {
      return res.status(201).json({ message: result.message });
    } else {
      return res.status(409).json({ error: result.message });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/", async (req, res) => {
  const options = {
    limit: req.query.limit,
    page: req.query.page,
    query: req.query.queryParams,
    sort: req.query.sort,
  };

  try {
    const result = await productManagerImport.getProductsQuery(options);
    res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:pid", async (req, res) => {
  let { pid } = req.params;

  try {
    const product = await productManagerImport.getProductById(pid);
    res.status(200).json(product);
  } catch (err) {
    if (err.message.includes("Product with id")) {
      res.status(404).json({ error404: err.message });
    }
  }
});

router.put("/:pid", async (req, res) => {
  const { pid } = req.params;
  const props = req.body;

  try {
    const updatedProduct = await productManagerImport.updateProduct(pid, props);

    res.status(200).json(updatedProduct);
  } catch (err) {
    if (err.message.includes("Product with id")) {
      res.status(404).json({ error404: err.message });
    } else if (err.message.includes("Cannot update")) {
      res.status(400).json({ error400: err.message });
    } else {
      res.status(500).json({ error500: "Internal Server Error" });
    }
  }
});

router.delete("/:pid", async (req, res) => {
  const productid = req.params.pid;
  try {
    let status = await productManagerImport.deleteProduct(productid);
    res.json({ success: true, status });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
}
);

export default router;