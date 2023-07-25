import fs from "fs";
import productManager from "./productManager.js";

const productManagerImport = new productManager("./product.json");

// creamos la clase carttManager y la exportamos
export default class cartManager {
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
  }
  // obtenemos los carts del json
  getCarts = async (cartId) => {
    try {
      const content = await fs.promises.readFile(this.path, this.format);
      const carts= JSON.parse(content);
      // si esta el id devolvemos un cart
      if (cartId) {
        const cart = carts.find((cart) => cart.id === cartId);
        if (cart) {
          return { success: true, cart };;
        } else {
          return [];
        }
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Internal Server Error" };
    }
  };
  // funcion para crear id automaticamente
  getNewId = async () => {
    const cartslist = await this.getCarts();
    let count = 0;
    cartslist.forEach((cart) => {
      if (cart.id > count) {
        count = cart.id;
      }
    });
    const newCount = ++count;
    return newCount;
  };
  // crea un cart
  createCart = async () => {
    try {
      const newId = await this.getNewId();
      const cart = { id: newId, products: [] };
      const carts = await this.getCarts();
      carts.push(cart);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(carts),
        this.format
      );
      return { success: true, message: `Cart with ID: ${newId} has been created.` };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error creating cart" };
    }
  };
  // funcion para modificar un cart
  updateCart = async (cartId, updatedCarts) => {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(updatedCarts),
        this.format
      );
      return { success: true, message: `Cart with ID: ${cartId} has been updated.` };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Error updating cart" };
    }
  };
// funcion para agregar items al carrito
addProductCart = async (cartId, productId, quantity = 1) => {
  try {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);

    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      const product = await productManagerImport.getProductById(productId);
      if (!product) {
        return { success: false, message: "Product Not Found" };
      }
      const productIndex = cart.products.findIndex(
        (product) => product.id === productId
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }
      await this.updateCart(cartId, carts);
      return { success: true, message: "Product added to cart successfully" };
    } else {
      return { success: false, message: "Cart Not Found" };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Internal Server Error" };
  }
}

}

