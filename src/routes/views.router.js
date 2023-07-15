import { Router } from "express";
import productManager from "../manager/productManager.js";

const router = Router();

// import de product manager para incorporar productos
const productManagerImport = new productManager("./product.json");

// routers para los views
router.get("/", (req, res) => {
    res.render("index", {});
});

router.get("/home", async (req, res) => {
    const products = await productManagerImport.getProducts();
    res.render("home", { products });
});

router.get("/realTimeProducts", async (req, res) => {
    const products = await productManagerImport.getProducts();
    res.render("realTimeProducts", { products });
});

router.get("/add-products", async (req, res) => {
    res.render("form", {});
});

router.post("/add-products", async (req, res) => {
    const { title, description, price, thumbnail, category, stock, code } =
        req.body;
    const result = await productManagerImport.addProduct(
        title,
        description,
        price,
        thumbnail,
        category,
        stock,
        code
    );
    res.redirect("/home");
});

export default router;
