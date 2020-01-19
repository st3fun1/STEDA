const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

let userCollection;

if (process.env.MONGO_URI) {
  MongoClient.connect(process.env.MONGO_URI, (err, mongoClient) => {
    if (err) throw new Error(err);
    const dbName = process.env.MONGO_URI.split("/")
      .pop()
      .split("?")
      .shift();

    const db = mongoClient.db(dbName);
    userCollection = db.collection("users");
  });
}
module.exports = expressApp => {
  if (expressApp === null) {
    throw new Error("expressApp option must be an express server instance");
  }

  expressApp.post("/auth/signup", async (req, res) => {
    const { signupEmail, signupPassword, signupRepeatPassword } = req.body;
    console.log("sign up", req.body);
    if (
      signupEmail &&
      signupPassword &&
      signupPassword === signupRepeatPassword
    ) {
      const userFound = await userCollection
        .find({
          email: signupEmail
        })
        .toArray();

      if (userFound.length) {
        // Conflict
        res.status(409).json({ error: "User already exists" });
      } else {
        try {
          const userInserted = await userCollection
            .insertOne({
              email: signupEmail,
              name: signupEmail,
              password: signupPassword
            })
            .toArray();
          res.json(userInserted);
        } catch (e) {
          res.status(500).json({ error: e });
        }
      }
    } else {
      res.status(500).json({ error: "Invalid form data." });
    }
  });

  expressApp.get("/api/user-list", (req, res) => {
    userCollection.find({}).toArray((err, users) => {
      if (err) {
        return res.send(500);
      }

      return res.json({ users });
    });
  });

  expressApp.get("/api/user/:id", (req, res) => {
    const userId = req.params.id;
    console.log("id", userId);
    userCollection
      .find({
        _id: ObjectId(userId)
      })
      .toArray((err, data) => {
        if (err) {
          return res.send(500);
        }

        return res.json({ user: data.length ? data[0] : null });
      });
  });
};
