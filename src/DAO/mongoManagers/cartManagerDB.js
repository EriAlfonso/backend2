import cartModel from "../models/carts.model.js";

export default
  class CartManager {

  createCart = async () => {
    try {
      const cart = {
        products: [],
      };

      await cartModel.create(cart);
      return "Cart created successfully";
    } catch (err) {
      throw err;
    }
  };

  getCarts = async () => {
    try {
      const carts = await cartModel.find();

      return carts;
    } catch {
      console.log("Carts not found");
      return [];
    }
  };

  getCartById = async (id) => {
    try {
      const cart = await cartModel.findById(id);

      if (cart === null) {
        console.error(`Cart with id: ${id} does not exist`);
        throw new Error(`Cart with id: ${id} does not exist`);
      }

      return cart;
    } catch (err) {
      throw err;
    }
  };

  updateCart = async (id, arrayProducts) => {
    try {
      const validate = await cartModel.findByIdAndUpdate(id, {
        products: arrayProducts,
      });

      if (validate === null) {
        console.log(`Cart with id: ${id} does not exist`);
        throw new Error(`Cart with id: ${id} does not exist`);
      }

      return "Cart products updated";
    } catch (err) {
      throw err;
    }
  };

  deleteCart = async (id) => {
    try {
      const cartDeleted = await cartModel.findByIdAndDelete(id);

      if (cartDeleted === null) {
        console.log("Cart does not exist");
        throw new Error("Cart does not exist");
      }

      return "Cart removed successfully";
    } catch (err) {
      throw err;
    }
  };
}