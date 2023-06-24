const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

router.get("/day", (req, res) => {
  const user = req.session.user;
  if (user) {
    res.render("pages/reports/day", { user, title: "Report by Day" });
  } else {
    res.redirect("/");
  }
});

module.exports = (io) => {
  io.on("connection", async (socket) => {
    console.log("A user connected");
    socket.on("getData", async () => {
      try {
        const mongoClient = new MongoClient(
          "mongodb+srv://admin:admin@steamcluster.azed00n.mongodb.net",
          { useUnifiedTopology: true }
        );
        await mongoClient.connect();
        const db = mongoClient.db("BETKUB_BETKUB");
        const collection = db.collection("history_bet");
        let data = await collection.find().toArray();
        socket.emit("newData", data);
        const changeStream = collection.watch();
        changeStream.on("change", async () => {
          const newMongoClient = new MongoClient(
            "mongodb+srv://admin:admin@steamcluster.azed00n.mongodb.net",
            { useUnifiedTopology: true }
          );
          await newMongoClient.connect();
          const newDb = newMongoClient.db("BETKUB_BETKUB");
          const newCollection = newDb.collection("history_bet");
          data = await newCollection.find().toArray();
          socket.emit("newData", data);
          await newMongoClient.close();
        });
      } catch (error) {
        console.error(error);
      }
    });
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return router;
};
