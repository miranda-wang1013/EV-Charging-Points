const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const pool = require("./database");
const app = express();

app.use(express.json());
app.use(cors());

app.get("/favorite-places", (req, res) => {
  const email = req.query.email;
  console.log(email);
  try {
    pool
      .query("SELECT * FROM accounts WHERE email = $1 ", [email])
      .then((response) => {
        console.log(response.rows);
        res.json(response.rows);
      })
      .catch((err) => {
        console.error("Error fetching data from database: ", err);
        res.status(500).send("Error fetching data from database");
      });
  } catch (err) {
    console.error("Error fetching data from database: ", err);
    res.status(500).send("Error fetching data from database");
  }
});

app.post("/favorite-places", (req, res) => {
  const email = req.body["email"];
  const id = req.body["id"];
  const place_id = req.body["place_id"];
  const is_favorite = req.body["is_favorite"];
  console.log(req.body);
  console.log("email:" + email);
  console.log("id:" + id);
  console.log("is_favorite:" + is_favorite);

  //inserting data into the table
  const insertSIMT = `INSERT INTO accounts (email, place_id, is_favorite) 
                   VALUES ('${email}', '${place_id}', '${is_favorite}');`;
  pool
    .query(insertSIMT)
    .then((response) => {
      console.log("Data saved");
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log();
  res.send("Response Received: " + req.body);
});

//delete favorite place
app.delete("/favorite-places/:placeId", (req, res) => {
  const { placeId } = req.params;
  const { email } = req.body;

  // Example of deleting from database using pool.query
  pool
    .query("DELETE FROM accounts WHERE email = $1 AND place_id = $2", [
      email,
      placeId,
    ])
    .then((response) => {
      if (response.rowCount > 0) {
        console.log(`Successfully deleted place with ID: ${placeId}`);
        res.status(200).send(`Deleted place with ID: ${placeId}`);
      } else {
        console.log(`No place found with ID: ${placeId} for email: ${email}`);
        res
          .status(404)
          .send(`No place found with ID: ${placeId} for email: ${email}`);
      }
    })
    .catch((error) => {
      console.error("Error deleting place:", error);
      res.status(500).send("Error deleting place");
    });
});

//localhost:4000
app.listen(4000, () => console.log("Server on localhhost:4000"));
