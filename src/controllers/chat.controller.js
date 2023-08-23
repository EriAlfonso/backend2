import chatManager from "../DAO/mongoManagers/chatManagerDB.js";

const chatManagerImport = new chatManager();

export default class chatController {
    async getChat(req, res) {
        const messages = await chatManagerImport.getMessages();
        const user = req.session.user;
        res.render("chat", { messages, user });
    }

    async sendMessage(req, res) {
        const { user, message } = req.body;
        try {
            const savedMessage = await chatManagerImport.saveMessage(user, message);
            res.json(savedMessage);
        } catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
const chatControllerimp = new chatController();
const { getChat, sendMessage } = chatControllerimp;
export {
    getChat, sendMessage
}