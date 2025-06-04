const express = require("express");
const cors = require("cors");
const Pusher = require("pusher");

const app = express();
app.use(cors());
app.use(express.json());

const pusher = new Pusher({
  appId: "2003207",
  key: "6136ef6aad376412a5ba",
  secret: "8437379a510390d80301",
  cluster: "ap2",
  useTLS: true,
});

app.post("/send", (req, res) => {
  const { name, image, message } = req.body;

  pusher.trigger("group-chat", "new-message", {
    name,
    image,
    message,
  });

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
