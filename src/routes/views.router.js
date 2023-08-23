import { Router } from "express";
import { getForm, getProductDetail, getProducts, getProductsHome, getRealTimeProducts, indexView, postNewProduct } from "../controllers/product.controller.js";
import { getChat, sendMessage } from "../controllers/chat.controller.js";
import { getCarts } from "../controllers/cart.controller.js";
import { getLogin, getLogout, getProfile, getRegister } from "../controllers/session.controller.js";
import auth from "../middlewares/authentication.js";

const router = Router();

router.get("/", indexView);
// product routers
router.get("/home", auth, getProductsHome);
router.get("/products", auth, getProducts);
router.get("/products/:pid", auth, getProductDetail);
router.get("/realTimeProducts", auth, getRealTimeProducts);
router.get("/add-products", auth, getForm);
router.post("/add-products", auth, postNewProduct);
// chat routers
router.get("/chat", auth, getChat);
router.post("/chat", auth, sendMessage);
// cart routers
router.get("/carts", auth, getCarts);
// session routers
router.get("/login", getLogin);
router.get("/register", getRegister);
router.get("/logout", auth, getLogout);
router.get("/profile", auth, getProfile);





export default router;
