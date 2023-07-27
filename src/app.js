import express from "express";
import cartRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import productRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import productManager from "./manager/productManager.js";

// import product manager
const productManagerImport = new productManager("./product.json");
// import de express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set de handlebars
app.engine(`handlebars`, handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// import de routers
app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);

// port con mensaje para validar que funcione
const httpServer = app.listen(8080, () => console.log("Server is Running.."));

// server con io
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("newProduct", async (newProduct) => {
    const { title, description, price, thumbnail, category, stock, code } =
      newProduct;
    await productManagerImport.addProduct(
      title,
      description,
      price,
      thumbnail,
      category,
      stock,
      code
    );
    const products = await productManagerImport.productsFile();

    io.emit("realtimetable", products);
  });
});

// 16:56
