const MongoClient = require("mongodb").MongoClient;

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
    usersCollection = db.collection("photos");
  });
}

module.exports = expressApp => {
  if (expressApp === null) {
    throw new Error("expressApp option must be an express server instance");
  }

  expressApp.get("/photo/list", (req, res) => {
    return new Promise((resolve, reject) => {
      resolve();
    })
      .then(photos => {
        return photos;
      })
      .then(count => {
        usersCollection.insertOne({
          url: "https://www.google.com",
          name: "Some Photo",
          year: 2019
        });
        usersCollection.insertMany([
          {
            url: "https://www.google3.com",
            name: "Some Photo 3",
            year: 2019
          },
          {
            url: "https://www.google3.com",
            name: "Some Photo 3",
            year: 2019
          },
          {
            url: "https://www.google4.com",
            name: "Some Photo 4",
            year: 2019
          },
          {
            url: "https://www.google5.com",
            name: "Some Photo 5",
            year: 2019
          },
          {
            url: "https://www.google6.com",
            name: "Some Photo 6",
            year: 2019
          }
        ]);
        usersCollection.find().toArray((err, photos) => {
          console.log("ph", photos);
        });

        usersCollection.deleteMany({ year: 2019 });
        return res.json(count);
      })
      .catch(err => {
        return res.status(500).json(err);
      });
  });
};
