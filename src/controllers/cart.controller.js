import cartManager from "../DAO/mongoManagers/cartManagerDB.js";
import cartModel from "../DAO/models/carts.model.js";

const cartManagerImport = new cartManager();

export default class cartController {
    async getCarts(req, res) {
        const carts = await cartModel.find();
        const user = req.session.user;
        const cartID = carts ? carts[0]._id : null;
        try {
            const cart = await cartManagerImport.getCartByIdAndPopulate(cartID);
            cart.products.forEach(product => {
                product.totalPrice = product.quantity * product._id.price;
                product.cartId = cartID.toString()
            });
            const cartTotalPrice = cart.products.reduce((total, product) => total + product.totalPrice, 0);
            res.render("carts", { products: cart.products, cartTotalPrice, user, });
        } catch (error) {
            console.error("Error fetching cart:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
const cartControllerimp = new cartController();
const { getCarts } = cartControllerimp;
export { getCarts }