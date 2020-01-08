const { MongoClient, ObjectId } = require("mongodb");

let commentCollection;
if (process.env.MONGO_URI) {
  // Connect to MongoDB Database and return comment collection

  MongoClient.connect(process.env.MONGO_URI, (err, mongoClient) => {
    if (err) throw new Error(err);
    const dbName = process.env.MONGO_URI.split("/")
      .pop()
      .split("?")
      .shift();
    const db = mongoClient.db(dbName);
    commentCollection = db.collection("comments");
  });
}

module.exports = expressApp => {
  if (expressApp === null) {
    throw new Error("expressApp option must be an express server instance");
  }

  // sanitizer
  expressApp.post("/api/comment", (req, res) => {
    const body = req.body;
    return new Promise((resolve, reject) => {
      commentCollection.insertOne(
        {
          photoId: req.body.photoId,
          userId: req.body.userId,
          comment: req.body.comment
        },
        (err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        }
      );
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  expressApp.get("/api/commentsByPhotoId/:photoId", (req, res) => {
    const photoId = req.params.photoId;
    console.log("a: ", photoId);
    return new Promise((resolve, reject) => {
      commentCollection
        .find({
          photoId
        })
        .limit(10)
        .sort({ $natural: -1 })
        .toArray((err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};
