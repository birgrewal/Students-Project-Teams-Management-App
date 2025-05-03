const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // For handling Cross-Origin Resource Sharing
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Enable CORS for all routes (you might want to restrict this in production)
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// MySQL Connection Configuration
const dbConfig = {
    host: 'localhost',      // Your MySQL host
    user: 'root',      // Your MySQL username
    password: 'root',  // Your MySQL password
    database: 'studentPMApp'  // Your MySQL database name
};

const db = mysql.createConnection(dbConfig);

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body
    try {
        const query = "SELECT * FROM userLogins WHERE userName = '" + username + "'";

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Failed to fetch data' });
                return;
            }

            if (results.length == 0) {
                return res.status(401).json({ error: 'Invalid credentials' }); // 401 for Unauthorized
            }

            const user = results[0]

            if (password === user.password) { //  <=====  INSECURE: DO NOT USE THIS IN PRODUCTION
                return res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } }); // Don't send the password back!
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/signup', (req, res) => {
    const { signUpUsername, fullName, email, phone, signUpPassword } = req.body;

    // if (!signUpUsername || !signUpPassword) {
    //     return res.status(400).json({ error: 'Username and password are required' });
    // }

    // Check if the username already exists
    const checkUserQuery = `SELECT * FROM userLogins WHERE userName = '${signUpUsername}'`;
    db.query(checkUserQuery, (err, existingUserResults) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (existingUserResults.length > 0) {
            return res.status(409).json({ error: 'Username already exists' }); // 409 Conflict
        }

        // Hash the password using bcrypt
        try {
            const hashedPassword = bcrypt.hash(signUpPassword, 10); // Await the hashing
            // Store the hashed password in the database
            const insertUserQuery = `INSERT INTO userLogins (userName, Name, Email, Phone, Password) VALUES ('${signUpUsername}', '${fullName}', '${email}', '${phone}', '${hashedPassword}' )`;
            db.query(insertUserQuery, (insertErr, insertResults) => {
                if (insertErr) {
                    console.error('Database query error:', insertErr);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                // Return success message
                return res.status(201).json({ message: 'Signup successful', userId: insertResults.insertId, username: username }); // 201 Created
            });
        } catch (hashError) {
            console.error('Password hashing error:', hashError);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// Example API endpoint to insert data into MySQL
// app.post('/api/data', async (req, res) => {
//     try {
//         const { name, value } = req.body; // Assuming you send name and value in the request body
//         const query = 'INSERT INTO your_table (name, value) VALUES (?, ?)';

//         db.query(query, [name, value], (err, result) => {
//             if (err) {
//                 console.error('Error inserting data:', err);
//                 res.status(500).json({ error: 'Failed to insert data' });
//                 return;
//             }
//             res.status(201).json({ message: 'Data inserted successfully', insertId: result.insertId });
//         });
//     } catch (error) {
//         console.error('Unexpected error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Close the MySQL connection when the Node.js process exits
process.on('SIGINT', () => {
    db.end(() => {
        console.log('MySQL connection closed');
        process.exit(0);
    });
});