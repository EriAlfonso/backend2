

export default class sessionController {
    getLogin(req, res) {
        if (req.session?.user) {
            res.redirect('/logout')
        }
        else
            res.render("login", {});
    }

    getRegister(req, res) {
        if (req.session?.user) {
            res.redirect('/profile')
        }
        res.render("register", {});
    }

    getLogout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
            res.redirect('/products');
        });
    }

    getProfile(req, res) {
        const user = req.session.user
        res.render("profile", user);
    }
}
const sessionControllerimp = new sessionController();
const { getLogin, getLogout, getProfile, getRegister } = sessionControllerimp
export { getLogin, getLogout, getProfile, getRegister }