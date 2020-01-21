const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const aws = require("aws-sdk");
const uuid = require("uuid");

let photoCollection;
let usersCollection;
let likesCollection;
if (process.env.MONGO_URI) {
  // Connect to MongoDB Database and return photo collection

  // TODO: create general db service
  MongoClient.connect(process.env.MONGO_URI, (err, mongoClient) => {
    if (err) throw new Error(err);
    const dbName = process.env.MONGO_URI.split("/")
      .pop()
      .split("?")
      .shift();
    const db = mongoClient.db(dbName);
    photoCollection = db.collection("photos");
    usersCollection = db.collection("users");
    likesCollection = db.collection("likes");
    likesCollection.createIndex({ userId: 1, photoId: 1 }, { unique: true });
  });
}

module.exports = expressApp => {
  if (expressApp === null) {
    throw new Error("expressApp option must be an express server instance");
  }

  expressApp.get("/api/photo/list", async (req, res) => {
    try {
      let photos = await photoCollection.find({}).toArray();
      const userIds = [...new Set(photos.map(photo => photo.userId))].map(id =>
        ObjectID(id)
      );
      const users = await usersCollection
        .find({
          _id: {
            $in: userIds
          }
        })
        .toArray();

      photos = photos.map(photo => ({
        ...photo,
        user: (function() {
          const userData = users.find(
            item => item._id.toString() === photo.userId.toString()
          );
          return userData
            ? {
                _id: userData.id,
                email: userData.email,
                name: userData.name,
                avatar: userData.avatar
              }
            : {};
        })()
      }));
      res.send(photos);
    } catch (e) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  expressApp.get("/api/photo/byUserId/:userId", (req, res) => {
    const userId = req.params.userId;
    return new Promise((resolve, reject) => {
      photoCollection
        .find({
          userId: ObjectID(userId)
        })
        .toArray((err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data);
        });
    })
      .then(photos => {
        res.json(photos);
      })
      .catch(err => {
        return res.status(500);
      });
  });

  expressApp.get("/api/photo/:photoId", async (req, res) => {
    const photoId = req.params.photoId;
    try {
      const photo = await photoCollection
        .find({
          _id: ObjectID(photoId)
        })
        .toArray();
      const user = await usersCollection
        .find({
          _id: ObjectID(photo[0].userId)
        })
        .toArray();
      // TODO: for current user

      const likes = await likesCollection
        .find({
          photoId: ObjectID(req.params.photoId),
          userId: ObjectID(req.session.passport.user.id)
        })
        .toArray();

      console.log("likes", likes);

      res.json({
        ...photo[0],
        user: user[0],
        liked: likes.length
      });
    } catch (e) {
      res.status(500).json(e);
    }
  });

  expressApp.delete("/api/photo/like", (req, res) => {
    const { photoId, userId } = req.body;

    return new Promise((resolve, reject) => {
      likesCollection.deleteOne(
        {
          photoId,
          userId
        },
        (err, data) => {
          if (err) reject(err);

          return resolve(data);
        }
      );
    })
      .then(data => res.json({ deleted: true }))
      .catch(err => res.status(500).json(err));
  });

  expressApp.post("/api/photo/like", (req, res) => {
    const { photoId, userId } = req.body;

    return new Promise((resolve, reject) => {
      likesCollection.insertOne(
        {
          photoId: ObjectID(photoId),
          userId: ObjectID(userId)
        },
        (err, data) => {
          if (err) reject(err);

          return resolve(data);
        }
      );
    })
      .then(data => res.json({ inserted: true }))
      .catch(err => {
        res.status(500);
      });
  });

  expressApp.get("/api/liked-photos/:userId", async (req, res) => {
    const userId = req.params.userId;

    try {
      const likedPhotos = await likesCollection
        .aggregate([
          {
            $match: {
              userId: ObjectID(userId)
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $lookup: {
              from: "photos",
              localField: "photoId",
              foreignField: "_id",
              as: "photo"
            }
          },
          {
            $project: {
              photo: {
                $arrayElemAt: ["$photo", 0]
              },
              user: {
                $arrayElemAt: ["$user", 0]
              }
            }
          }
        ])
        .toArray();
      res.send({ likedPhotos });
    } catch (e) {
      res.send(500).json(e);
    }
  });

  expressApp.post("/api/media/upload", async (req, res) => {
    // url regex + sanitizer + find if safe
    if (req.body.fileLink) {
      const { description, userId, fileLink } = req.body;
      try {
        const inserted = await photoCollection.insertOne({
          description,
          userId: ObjectID(userId),
          fileLink
        });
        res.json(inserted);
      } catch (e) {
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.status(403).json({ error: "Invalid operation" });
    }
  });

  expressApp.post("/api/photo/upload", (req, res) => {
    let userData = null;
    try {
      userData = JSON.parse(req.body.user);
    } catch (e) {
      return res.status(500).json({ error: "Internal server error" });
    }

    const s3 = new aws.S3({
      accessKeyId: process.env.AMAZON_S3_ID,
      secretAccessKey: process.env.AMAZON_S3_SECRET,
      region: process.env.BUCKET_REGION
    });

    if (req.file) {
      const key = userData.id + "-" + uuid() + "-" + req.file.originalname;

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: process.env.AMAZON_ACCESS_CONTROL
      };

      s3.upload(params, (err, data) => {
        if (err) {
          return res.status(500).json({ error: true, Message: err });
        } else {
          let photoName;
          try {
            photoName = JSON.parse(req.body.photo).name;
          } catch (e) {
            photoName = req.file.originalname;
          }
          const newUploadedFile = {
            description: photoName,
            fileLink: process.env.AMAZON_S3_FILE_URL + key,
            location: data.Location,
            s3_key: key,
            userId: userData ? ObjectID(userData.id) : null
          };

          photoCollection.insertOne(newUploadedFile, (err, data) => {
            if (err) res.status(500).json(err);

            return res.send(newUploadedFile);
          });
        }
      });
    } else {
      return res
        .status(500)
        .json({ error: true, Message: "Error with the file upload system" });
    }
  });
};
