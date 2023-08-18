import { Router } from "express";
import userModel from "../../DAO/models/user.model.js";
const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email, password })
    if(!user) return res.redirect('login')

    req.session.user = user
    
    return res.redirect('/products')
})

router.post('/register', async (req, res) => {
    const user = req.body
    await userModel.create(user)

    return res.redirect('/login')
})

export default router;