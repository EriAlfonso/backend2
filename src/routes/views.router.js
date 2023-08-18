import { Router } from "express";
import productManager from "../DAO/mongoManagers/productManagerDB.js";
import chatManager from "../DAO/mongoManagers/chatManagerDB.js";
import cartManager from "../DAO/mongoManagers/cartManagerDB.js";
import cartModel from "../DAO/models/carts.model.js";

const router = Router();

// import de product manager para incorporar productos
const productManagerImport = new productManager();
const chatManagerImport = new chatManager();
const cartManagerImport = new cartManager();

// routers para los views
router.get("/", (req, res) => {
  res.render("index", {});
});

router.get("/home", async (req, res) => {
  const products = await productManagerImport.getProducts();
  const idString = products.products.map((product) => ({
    ...product,
    _id: product._id.toHexString(),
  }));
  res.render("home", { products: idString });
});


router.get("/products", async (req, res) => {
  const options = {
    limit: req.query.limit,
    page: parseInt(req.query.page) || 1,
    query: req.query.queryParams,
    sort: req.query.sort,
  };
  const user = req.session.user;
  try {
    const result = await productManagerImport.getProductsQuery(options);
    res.render("products", {
      user,
      products: result.payload,
      totalPages: result.totalPages,
      currentPage: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/products/:pid", async (req, res) => {
  let { pid } = req.params;
  const carts = await cartModel.find();
  const cartID = carts ? carts[0]._id : null;
  try {
    const product = await productManagerImport.getProductById(pid);
    res.render("productDetails", {
      title: product.title,
      description: product.description,
      price: product.price,
      thumbnail: product.thumbnail,
      id:product._id,
      cartID
    });
  } catch (err) {
    if (err.message.includes("Product with id")) {
      res.status(404).json({ error404: err.message });
    }
  }
});

router.get("/realTimeProducts", async (req, res) => {
  const products = await productManagerImport.getProducts();
  const idString = products.products.map((product) => ({
    ...product,
    _id: product._id.toHexString(),
  }));

  res.render("realTimeProducts", { products: idString });
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

router.get("/chat", async (req, res) => {
  const messages = await chatManagerImport.getMessages();
  res.render("chat", { messages });
});

router.post("/chat", async (req, res) => {
  const { user, message } = req.body;
  try {
    const savedMessage = await chatManagerImport.saveMessage(user, message);
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/carts", async (req, res) => {
  const carts = await cartModel.find();
  const cartID = carts ? carts[0]._id : null;
  try {
    const cart = await cartManagerImport.getCartByIdAndPopulate(cartID);
    console.log(cart)
    res.render("carts", { products:cart.products});
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/login", (req, res) => {
  if(req.session?.user) {
    res.redirect('/logout')
}
else
  res.render("login", {});
});

router.get("/register", (req, res) => {

  if(req.session?.user) {
    res.redirect('/profile')
}

  res.render("register", {});
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect('/products');
  });
});


function auth(req, res, next) {
  if(req.session?.user) return next()
  res.redirect('/login')
}

router.get("/profile",auth, (req, res) => {
  const user = req.session.user
  res.render("profile", user);
});





export default router;
