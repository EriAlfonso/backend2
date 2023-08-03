import { Router } from "express"
import chatManager from "../../DAO/mongoManagers/chatManagerDB.js"

const router = Router();
const chatManagerImport = new chatManager()
router.get("/", async (req, res) => {
  try {
    const messages = await chatManagerImport.getMessages();
    if (req.accepts("json")) {
      res.json(messages);
    } else {
      res.render("chat", { messages });
    }
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  const { user, message } = req.body;
  if (!user || !message) {
    return res.status(400).json({ error: "Both user and message are required" });
  }

  try {
    const newMessage = await chatManagerImport.saveMessage(user, message);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving chat message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



export default router