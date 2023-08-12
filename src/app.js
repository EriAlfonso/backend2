import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import cartRouter from "./routes/mongoRouters/carts.router.js";
import productRouter from "./routes/mongoRouters/products.router.js";
import viewsRouter from "./routes/views.router.js";
import chatRouter from "./routes/mongoRouters/chat.router.js"
import sessionRouter from "./routes/mongoRouters/session.router.js"
import productManager from "./DAO/mongoManagers/productManagerDB.js";
import chatManager from "./DAO/mongoManagers/chatManagerDB.js";


// import product manager
const productManagerImport = new productManager();
const chatManagerImport = new chatManager();

const mongoURL = "mongodb+srv://thecheesegw2:rR4XFxtyluPWOvpt@ecommerce.e86wvix.mongodb.net/?retryWrites=true&w=majority"

// import de express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set de static
app.use(express.static("./src/public"));


// set de handlebars
app.engine(`handlebars`, handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// import de routers
app.use("/", viewsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/products", productRouter);
app.use("/api/chat", chatRouter)
app.use("/api/session", sessionRouter)

// port con mensaje para validar que funcione
const httpServer = app.listen(8080, () => console.log("Server is Running.."));

// conneccion a mongo 
mongoose.connect(mongoURL, {
  dbName: "ecommerce",
})
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    console.error(error);
  });

app.use(session({
  store: MongoStore.create({
  mongoUrl: mongoURL,
  dbName: "ecommerce",
  mongoOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  ttl: 100,
}),
secret: "secret",
resave: true,
saveUninitialized: true,
})
);
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
    const products = await productManagerImport.getProducts();

    io.emit("realtimetable", products.products);
  });
});

io.on("connection", (socket) => {
  let username;


  socket.on("setUsername", (name) => {
    username = name;
    io.emit("userJoined", username);
  });

  socket.on("saveMessage", async (data) => {
    try {
      const newMessage = await chatManagerImport.saveMessage(data.user, data.message);
      io.emit("receiveMessage", newMessage);
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  });
  socket.on("disconnect", () => {
    if (username) {
      io.emit("userLeft", username);
    }
  });
});


