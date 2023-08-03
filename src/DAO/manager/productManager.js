import fs from "fs";

// creamos la clase ProductManager y la exportamos
export default class productManager {
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
  }


  productsFile = async () => {
    try {
      const content = await fs.promises.readFile(this.path, this.format);
      return JSON.parse(content.toString());
    } catch (error) {
      console.error("Error reading products file:", error);
      return [];
    }
  };

  // muestra todos los productos en el array
  getProducts = async (limit) => {
    const products = await this.productsFile(this.path, this.format);
    if (products.length === 0) {
      return { success: false, message: "No products found" };
    }
    if (limit !== undefined && limit <= 0) {
      return { success: false, message: "Invalid number" };
    }
    if (limit && limit > 0) {
      const productLimit = products.slice(0, limit);
      return { success: true, products: productLimit };
    }
    return { success: true, products };
  };

  // funcion para crear el id o code
  getNewId = async () => {
    const productList = await this.productsFile(this.path, this.format);
    let count = 0;
    productList.forEach((product) => {
      if (product.id > count) {
        count = product.id;
      }
    });
    const newCount = ++count;
    return newCount;
  };

  // funcion para agregar producto
  addProduct = async (
    title,
    description,
    price,
    thumbnail,
    category,
    stock,
    code
  ) => {
    // verificamos que esten todos los keys presente.
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !stock ||
      !code ||
      !category
    ) {
      return { success: false, message: "Error: Missing Variables" };
    }
    const productList = await this.productsFile(this.path, this.format);
    // codigo para impedir la repeticion de la variable "code"
    const codeExists = productList.find((product) => product.code === code);
    if (codeExists) {
      return {
        success: false,
        message: `product with code ${code} already exists.`,
      };
    }
    // id creado automaticamente
    const id = await this.getNewId();
    const product = {
      id: parseInt(id),
      title,
      description,
      price: `$${price}`,
      status: true,
      thumbnail,
      category,
      code,
      stock,
    };
    productList.push(product);
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(productList),
        this.format
      );
      return { success: true, message: "Product added successfully" };
    } catch (error) {
      return { success: false, message: "Error saving the product" };
    }
  };

  // buscador de producto por id
  getProductById = async (id) => {
    try {
      const products = await this.productsFile(this.path, this.format);
      if (products.length === 0) {
        return { success: false, message: "No products found" };
      }
      const product = products.find((product) => product.id === id);
      if (product) {
        return { success: true, product };
      } else {
        return { success: false, message: "Product Not Found" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Internal Server Error" };
    }
  };

  // actualiza el producto usando su id para buscarlo
  updateProduct = async (
    id,
    title,
    description,
    price,
    thumbnail,
    category,
    stock,
    code
  ) => {
    const update = {
      title,
      description,
      price: `$${price}`,
      thumbnail,
      category,
      stock,
      code,
    };

    try {
      const productid = await this.getProductById(id);
      if (productid.success) {
        const product = productid.product;
        const productList = await this.productsFile(this.path, this.format);
        const productIndex = productList.findIndex((prod) => prod.id === id);

        if (productIndex !== -1) {
          const updatedProduct = { ...productList[productIndex], ...update };
          productList[productIndex] = updatedProduct;

          await fs.promises.writeFile(
            this.path,
            JSON.stringify(productList),
            this.format
          );
          return { success: true, updatedProduct };
        }
      }
      else {
        return { success: false, message: "Product not found" };
      }
    } catch (error) {
      return { success: false, message: "Error updating the product" };
    }
  };

  // funcion para borra producto por id
  deleteProduct = async (id) => {
    let productlist = await await this.productsFile(this.path, this.format);
    try {
      const index = productlist.findIndex((prod) => prod.id === id);
      if (index !== -1) {
        productlist.splice(index, 1);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(productlist),
          this.format
        );
        return { success: true, message: "Product deleted successfully" };
      } else {
        return { success: false, message: "Product Not Found" };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "Internal Server Error" };
    }
  };
}
