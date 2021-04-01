const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'development',
  password: 'development',
  database: 'lightbnb'
});

pool.connect((err) => {
  if (err) throw new Error(err);
  console.log('connected!');
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithEmail = function(email) {
  return pool.query(`SELECT * FROM users WHERE email = $1`, [email.toLowerCase()])
    .then(res => {
      return res.rows[0];
    })    
}


exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */

const getUserWithId = function(id) {
  return pool.query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then(res => { 
      return res.rows[0]
    })
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */

const addUser =  function(user) {
  return pool.query(`
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`,[user.name, user.email, user.password])
    .then(res => {
      return res.rows[0]
    })
}
exports.addUser = addUser;


/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */

const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`
    SELECT * FROM reservations
    JOIN properties ON property_id = properties.id
    WHERE guest_id = $1  
    LIMIT $2;  
    `, [guest_id, limit])
    .then(res => res.rows)
    .catch(err => console.log(err))
  ;
}

exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */


// const getAllProperties = function(options, limit = 10) {
//   return pool.query(`
//   SELECT * FROM properties
//   LIMIT $1
//   `, [limit])
//   .then(res => res.rows)
//   .catch(err => console.log(err));
// }

const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  let hasWhereClause = false;
  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` WHERE city LIKE $${queryParams.length} `;
    hasWhereClause = true;
  }


  //// not sure of this
  if (options.owner_id) {
      queryParams.push(options.owner_id);
    if(hasWhereClause) {
      queryString += ` AND owner_id LIKE $${queryParams.length}`;
    } else {
      queryString += ` WHERE owner_id LIKE $${queryParams.length}`;
    }
  }

  if (options.minimum_price_per_night && options.maximum_price_per_night) { 

     queryParams.push(parseInt(options.minimum_price_per_night, 10) * 100);
     queryParams.push(parseInt(options.maximum_price_per_night, 10) * 100);

    if(hasWhereClause){

      queryString += ` AND cost_per_night >= $${queryParams.length - 1}`;
      queryString += ` AND cost_per_night <= $${queryParams.length}`;

    } else {

      queryString += ` WHERE cost_per_night >= $${queryParams.length -1}`;
      queryString += ` AND cost_per_night <= $${queryParams.length}`
    }
  }

  if(options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    if(hasWhereClause) {
      queryString += ` AND rating >= $${queryParams.length}`;
    } else {
      queryString += ` WHERE rating >= $${queryParams.length}`;
    }
  }
  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log('query strin',queryString, 'query params', queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
