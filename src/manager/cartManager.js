import fs from "fs";

// creamos la clase carttManager y la exportamos
export default class cartManager {
    constructor(path) {
        this.path = path;
        this.format = "utf-8";
    }
// obtenemos los carts del json
    getCarts = async () => {
      try {
        const content = await fs.promises.readFile(this.path, this.format);
        return JSON.parse(content);
      } catch (error) {
        console.error("Error: No Carts Found", error);
        return [];
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
          await fs.promises.writeFile(this.path, JSON.stringify(carts), this.format);
          console.log(`Cart with ID: ${newId} has been created.`);
        } catch (error) {
          console.error("Error creating cart:", error);
        }
      };
      // funcion para modificar un cart
      updateCart = async (cartId, updatedCarts) => {
        try {
          await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts), this.format);
          console.log(`Cart with ID: ${cartId} has been updated.`);
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      };
    
    }
