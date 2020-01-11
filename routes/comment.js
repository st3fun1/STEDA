const { MongoClient, ObjectId } = require("mongodb");

let commentCollection;
let usersCollection;
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
    usersCollection = db.collection("users");
  });
}

module.exports = expressApp => {
  if (expressApp === null) {
    throw new Error("expressApp option must be an express server instance");
  }

  // TODO: sanitizer
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
          usersCollection
            .find({
              _id: ObjectId(req.body.userId)
            })
            .toArray((err, user) => {
              if (err) reject(err);
              resolve({
                ...data.ops[0],
                user: user[0]
              });
            });
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
    return new Promise((resolve, reject) => {
      commentCollection
        .find({
          photoId
        })
        .limit(5)
        .sort({ $natural: -1 })
        .toArray((err, comments) => {
          if (err) {
            return reject(err);
          }
          const userIds = [
            ...new Set(comments.map(comment => comment.userId))
          ].map(id => ObjectId(id));
          usersCollection
            .find({
              _id: {
                $in: userIds
              }
            })
            .toArray((err, users) => {
              if (err) reject(err);
              resolve({
                data: comments.map(comment => ({
                  ...comment,
                  user: users.find(
                    item => item._id.toString() === comment.userId
                  )
                }))
              });
            });
        });
    })
      .then(data => {
        res.send({
          photoId,
          data: data.data
        });
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
};
