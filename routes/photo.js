const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const aws = require("aws-sdk");
const uuid = require("uuid");

let photoCollection;
if (process.env.MONGO_URI) {
  // Connect to MongoDB Database and return photo collection

  MongoClient.connect(process.env.MONGO_URI, (err, mongoClient) => {
    if (err) throw new Error(err);
    const dbName = process.env.MONGO_URI.split("/")
      .pop()
      .split("?")
      .shift();
    const db = mongoClient.db(dbName);
    photoCollection = db.collection("photos");
  });
}

module.exports = expressApp => {
  if (expressApp === null) {
    throw new Error("expressApp option must be an express server instance");
  }

  expressApp.get("/api/photo/list", (req, res) => {
    return new Promise((resolve, reject) => {
      photoCollection.find({}).toArray((err, data) => {
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

  expressApp.get("/api/photo/:photoId", (req, res) => {
    const photoId = req.params.photoId;
    return new Promise((resolve, reject) => {
      photoCollection
        .find({
          _id: ObjectID(photoId)
        })
        .toArray((err, data) => {
          if (err) {
            return reject(err);
          }
          return resolve(data ? data[0] : null);
        });
    })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        return res.status(500);
      });
  });

  expressApp.post("/api/photo/upload", (req, res) => {
    let userData = null;
    try {
      userData = JSON.parse(req.body.user);
    } catch (e) {
      console.log("Invalid JSON");
    }

    const s3 = new aws.S3({
      accessKeyId: process.env.AMAZON_S3_ID,
      secretAccessKey: process.env.AMAZON_S3_SECRET,
      region: process.env.BUCKET_REGION
    });

    if (req.file) {
      const key = uuid() + "-" + req.file.originalname;

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
          const newUploadedFile = {
            description: req.file.originalname,
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
