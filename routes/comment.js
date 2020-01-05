const { MongoClient, ObjectID } = require("mongdb");

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
