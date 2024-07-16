const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "54325432",
  host: "localhost",
  port: 5433,
  database: "fav_list",
});

// const createTblQry = `CREATE TABLE accounts(
//     email serial PRIMARY KEY,
//     id VARCHAR (50) UNIQUE NOT NULL,
//     is_favorite BOOLEAN NOT NULL
//     );`;

// pool
//   .query(createTblQry)
//   .then((Response) => {
//     console.log("Table created");
//     console.log(Response);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = pool;
