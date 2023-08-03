import productModel from "../models/products.model.js";

export default class productManager {


  addProduct = async (title, description, price, thumbnail, category, stock, code) => {
    try {
      const validate = await productModel.findOne({ code });
      if (validate) {
        return {
          success: false,
          message: `Product with code ${code} already exists.`,
        };
      } else {
        const newProduct = {
          title,
          description,
          price,
          thumbnail,
          category,
          stock,
          code,
          status: true,
        };

        await productModel.create(newProduct);
        return { success: true, message: "Product created successfully" };
      }
    } catch (error) {
      throw error;
    }
  };

  getProducts = async () => {
    try {
      const products = await productModel.find().lean().exec();
      return { success: true, products };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  getProductById = async (id) => {
    try {
      const product = await productModel.findById(id);

      return product;
    } catch (error) {
      throw error;
    }
  };

  updateProduct = async (id, props) => {
    try {
      const validate = await productModel.findByIdAndUpdate(id, props);

      if (props.hasOwnProperty("id") || props.hasOwnProperty("code")) {
        console.log("Cannot update 'id' or 'code' property");
        throw new Error("Cannot update 'id' or 'code' property");
      }

      if (validate === null) {
        console.log(`Product with id: ${id} does not exist`);
        throw new Error(`Product with id: ${id} does not exist`);
      }

      return "Updated product successfully";
    } catch (err) {
      throw err;
    }
  };

  deleteProduct = async (_id) => {
    try {
      const productDeleted = await productModel.findByIdAndDelete(_id);

      if (productDeleted === null) {
        throw new Error("Product does not exist");
      }

      return "Product removed successfully";
    } catch (error) {
      throw error;
    }
  };



}