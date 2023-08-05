import { Router } from 'express';
import productManager from '../../DAO/mongoManagers/productManagerDB.js';
import productModel from '../../DAO/models/products.model.js';

const router = Router();

// import de product manager
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
  const { limit = 10, page = 1, query, sort } = req.query;

  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);

  try {
    let queryOptions = {};
    if (req.query.queryParams) {
      const field = req.query.queryParams.split(",")[0];
      let value = req.query.queryParams.split(",")[1];

      if (!isNaN(parseInt(value))) {
        value = parseInt(value);
      }

      queryOptions[field] = value;
    }
    const result = await productModel.paginate(queryOptions, {
      sort: sort === "descending" ? { price: -1 } : sort === "ascending" ? { price: 1 } : {},
      limit: parsedLimit,
      page: parsedPage,
    });

    const response = {
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage
        ? `/products?limit=${limit}&page=${result.prevPage}`
        : null,
      nextLink: result.hasNextPage
        ? `/products?limit=${limit}&page=${result.nextPage}`
        : null,
    };
    res.json(response);
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