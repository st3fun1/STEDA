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
    const { photoId, userId, comment, date } = req.body;
    return new Promise((resolve, reject) => {
      commentCollection.insertOne(
        {
          photoId,
          userId,
          comment,
          date
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
    const resPerPage = 5;
    const page = req.params.page || 0;
    return new Promise((resolve, reject) => {
      commentCollection
        .find({
          photoId
        })
        .sort({ $natural: -1 })
        .skip(resPerPage * (page === 0 ? 0 : page) - page)
        .limit(resPerPage)
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
                data: comments
                  .map(comment => ({
                    ...comment,
                    user: users.find(
                      item => item._id.toString() === comment.userId
                    )
                  }))
                  .reverse()
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
