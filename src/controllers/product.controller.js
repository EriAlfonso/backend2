import productManager from "../DAO/mongoManagers/productManagerDB.js";
import cartModel from "../DAO/models/carts.model.js";

const productManagerImport = new productManager();

export default class productController {
    async indexView(req, res) {
        res.render("index", {});
    };

    async getProductsHome(req, res) {
        const products = await productManagerImport.getProducts();
        const idString = products.products.map((product) => ({
            ...product,
            _id: product._id.toHexString(),
        }));
        res.render("home", { products: idString });
    };

    async getProducts(req, res) {
        const options = {
            limit: req.query.limit,
            page: parseInt(req.query.page) || 1,
            query: req.query.queryParams,
            sort: req.query.sort,
        };
        const user = req.session.user;
        try {
            const result = await productManagerImport.getProductsQuery(options);
            res.render("products", {
                user,
                products: result.payload,
                totalPages: result.totalPages,
                currentPage: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink,
            });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

    async getProductDetail(req, res) {
        let { pid } = req.params;
        const carts = await cartModel.find();
        const cartID = carts ? carts[0]._id : null;
        const user = req.session.user;
        try {
            const product = await productManagerImport.getProductById(pid);
            res.render("productDetails", {
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: product.thumbnail,
                stock: product.stock,
                category: product.category,
                id: product._id,
                cartID,
                user
            });
        } catch (err) {
            if (err.message.includes("Product with id")) {
                res.status(404).json({ error404: err.message });
            }
        }
    };

    async getRealTimeProducts(req, res) {
        const products = await productManagerImport.getProducts();
        const idString = products.products.map((product) => ({
            ...product,
            _id: product._id.toHexString(),
        }));
        const user = req.session.user;
        res.render("realTimeProducts", { products: idString, user });
    };

    async getForm(req, res) {
        const user = req.session.user;
        res.render("form", { user });
    };

    async postNewProduct(req, res) {
        const { title, description, price, thumbnail, category, stock, code } =
            req.body;

        const result = await productManagerImport.addProduct(
            title,
            description,
            price,
            thumbnail,
            category,
            stock,
            code
        );
        res.redirect("/home");
    };

}

const productControllerimp = new productController();
const { getProducts, getProductsHome, postNewProduct, getForm, getRealTimeProducts, getProductDetail, indexView } = productControllerimp;
export {
    getForm, getProductDetail, getProductsHome, getRealTimeProducts, postNewProduct, getProducts, indexView
}
