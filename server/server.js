const express = require('express');
const cookieParser = require('cookie-parser')
const mysql = require('mysql2');
const cors = require('cors'); // For handling Cross-Origin Resource Sharing
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;


// Enable CORS for all routes (you might want to restrict this in production)
app.use(cors());
app.use(express.json()); // Middleware to parse JSON request bodies

// Cookie parser middleware
app.use(cookieParser());

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

            if (user.Password == password) {
                res.cookie('username', user.userName)
                // return res.status(200).json({ message: 'Login successful', value: 'd ' + req.cookies.username, user: { id: user.userID, username: user.userName } });
                res.send('Login successful')
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }


            // bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
            //     if (bcryptErr) {
            //         console.error('bcrypt compare error:', bcryptErr);
            //         return res.status(500).json({ error: 'Internal server error' + user.password + ' ' + password });
            //     }
            //     if (isMatch) {
            //         return res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
            //     } else {
            //         return res.status(401).json({ error: 'Invalid credentials' + user.password });
            //     }
            // });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('username')
    res.send(res.cookies.username + 'userLoggedOut' + res.cookies)
});

app.get('/loggedin', (req, res) => {
    if (req.cookies.username != undefined) {
        res.send(req.cookies.username)
    } else {
        res.send("")
    }
})

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

            // Currently Used SignupPassword Will Turn back to hashed
            const insertUserQuery = `INSERT INTO userLogins (userName, Name, Email, Phone, Password) VALUES ('${signUpUsername}', '${fullName}', '${email}', '${phone}', '${signUpPassword}' )`;
            db.query(insertUserQuery, (insertErr, insertResults) => {
                if (insertErr) {
                    console.error('Database query error:', insertErr);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                // Return success message
                return res.status(201).json({ message: 'Signup successful', userId: insertResults.insertId, username: signUpUsername }); // 201 Created
            });
        } catch (hashError) {
            console.error('Password hashing error:', hashError);
            return res.status(500).json({ error: 'Internal server error' });
        }
    });
});

app.post('/createProject', (req, res) => {
    const { projectTitle, projectSummary, membersArray, createdBy } = req.body;

    membersArray.forEach(member => {
        const checkMemberQuery = `SELECT * FROM userLogins WHERE userName = '${member}'`

        db.query(checkMemberQuery, (err, userExists) => {
            if (userExists.length == 0) {
                return res.status(404).json({ error: `${member} Not Found` }); // 404 Not Found
            }
        })
    });

    const checkUserQuery = `SELECT * FROM projects WHERE title = '${projectTitle}'`;
    db.query(checkUserQuery, (err, existingUserResults) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (existingUserResults.length > 0) {
            return res.status(409).json({ error: 'Project Name already exists' }); // 409 Conflict
        }

        const insertUserQuery = `INSERT INTO projects (title, summary, members, createdby) VALUES ("${projectTitle}", "${projectSummary}", "${members}", ${createdBy} )`;
        db.query(insertUserQuery, (insertErr, insertResults) => {
            if (insertErr) {
                console.error('Database query error:', insertErr);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Return success message
            return res.status(201).json({ message: 'successful' }); // 201 Created
        });

    });
});

app.get('/getProjects', (req, res) => {
    try {
        const query = "SELECT * FROM projects";

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ error: 'Failed to fetch data' });
                return;
            }

            res.json(results);

        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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