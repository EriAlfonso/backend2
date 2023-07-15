import { Router } from "express";
import cartManager from "../manager/cartManager.js";
import productManager from '../manager/productManager.js';
const router = Router();

const cartManagerImport = new cartManager('../cart.json');
const productManagerImport = new productManager('../product.json');
// CART

// Post para crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
      // usamos el create cart para crear el carrito
      await cartManagerImport.createCart();
      res.status(201).json({ message: 'Cart created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Get para ver lista de productos segun el cart
router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    
    try {
      // usamos el get carts para traer el json con los carts
      const carts = await cartManagerImport.getCarts();
      // buscamos el cart con el id 
      const cart = carts.find((cart) => cart.id === cartId);
  // mostramos el cart 
      if (cart) {
        res.json(cart);
        // un notfound por si no existe
      } else {
        res.status(404).send('Cart Not Found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Post para agregar productos
router.post('/:cid/product/:pid', async (req, res) => {
  // parseamos los params
  const cartId = parseInt(req.params.cid);
  const productId = parseInt(req.params.pid);
  // creamos un quantity con 1 y un parse int por si queremos agregarlo manualmente
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    // usamos el getcarts
    const carts = await cartManagerImport.getCarts();
    const cartIndex = carts.findIndex((cart) => cart.id === cartId);
    // encontramos el cart con el id que pasamos
    if (cartIndex !== -1) {
      const cart = carts[cartIndex];
      // buscamos el producto que queremos agregar con getproductby id,en caso de no exister devuelve notfound
      const product = await productManagerImport.getProductById(productId);
      if (!product) {
        return res.status(404).send('Product Not Found');
      }
      // verificamos si existe ese id en el cart
      const productIndex = cart.products.findIndex((product) => product.id === productId);
      // si existe el producto le agregamos 1 a quantity
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        // si no pusheamos un producto nuevo con quantity 1
        cart.products.push({ id: productId, quantity });
      }
      await cartManagerImport.updateCart(cartId, carts); 
      res.json({ message: 'Product added to cart successfully' });
    } else {
      res.status(404).send('Cart Not Found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router
