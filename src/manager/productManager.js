import fs from "fs";

// creamos la clase ProductManager y la exportamos
export default class productManager {
  constructor(path) {
    this.path = path;
    this.format = "utf-8";
  }

  // muestra todos los productos en el array
  getProducts = async (limit) => {
    const content = await fs.promises.readFile(this.path, this.format);
    const products=JSON.parse(content.toString());
    if (products.length === 0) {
      return { success: false, message: "No products found" };
    }
    if (limit !== undefined && limit <= 0) {
      return { success: false, message: "Invalid number" };
    }
    if (limit && limit > 0) {
      const productLimit= products.slice(0, limit);
      return { success: true, products:productLimit }
    }
    return { success: true, products };
};

  // funcion para crear el id o code
  getNewId = async () => {
    const productList = await this.getProducts();
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
    const productList = await this.getProducts();
    // codigo para impedir la repeticion de la variable "code"
    const codeExists = productList.find((product) => product.code === code);
    if (codeExists) {
      return { success: false, message: "roduct with code ${code} already exists." };
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
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productList),
      this.format
    );
    return { success: true, message: "Product added successfully" }
  };

  // buscador de producto por id
  getProductById = async (id) => {
    const productList = await this.getProducts();
    const product = productList.find((product) => product.id === id);
    return product;
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
      id,
      title,
      description,
      price: `$${price}`,
      thumbnail,
      category,
      stock,
      code,
    };
    const productList = await this.getProducts();
    const product = await this.getProductById(id);

    if (product) {
      // Update the product properties
      const updatedProduct = { ...product, ...update };
      const updatedProductList = productList.map((item) =>
        item.id === id ? updatedProduct : item
      );

      await fs.promises.writeFile(
        this.path,
        JSON.stringify(updatedProductList),
        this.format
      );
      return { success: true, message: "Product updated successfully" };
    } else {
      return { success: false, message: "Product not Found" };
    }
  };

  // funcion para borra producto por id
  deleteProduct = async (id) => {
    let productlist = await this.getProducts();
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
