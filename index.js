const express = require("express");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x53s3dr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("tripyTravel");
    const toursCollection = database.collection("tours");
    const bookingsCollection = database.collection("bookings");

    // GET API
    app.get("/tours", async (req, res) => {
      const cursor = await toursCollection.find({});
      const tours = await cursor.toArray();
      res.json(tours);
    });

    app.get("/tours/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await toursCollection.findOne(query);
      res.json(tour);
    });

    app.get("/bookings", async (req, res) => {
      const cursor = await bookingsCollection.find({});
      const bookings = await cursor.toArray();
      res.json(bookings);
    });

    // POST API
    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking);
      res.json(result);
    });

    app.post("/tours", async (req, res) => {
      const tour = req.body;
      const result = await toursCollection.insertOne(tour);
      res.json(result);
    });

    // PUT API
    app.put("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const bookingAccept = req.body;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateBooking = {
        $set: {
          bookingStatus: bookingAccept.bookingStatus,
        },
      };
      const result = await bookingsCollection.updateOne(
        query,
        updateBooking,
        options
      );
      res.json(result);
    });

    // DELETE API
    app.delete("/booking/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Trabook!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
