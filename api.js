import cors from 'cors'
import express from 'express'
import multer from 'multer'
import path from 'path'
import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'

const app = express()
const port = 4001
const db = new sqlite3.Database('memories.db')

import { validateParamId } from './api.validators.js'

app.use(express.json())
app.use(cors())

// Set up multer for image uploads
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const upload = multer({ dest: path.join(__dirname, 'uploads/') })

// Add user table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT, 
      name TEXT,
      description TEXT
    )
  `)
})

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      'date' TEXT,
      imageUrl TEXT,
      user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)
})

// Endpoint to upload an image
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Please provide an image' })
    return
  }

  const imageUrl = `/uploads/${req.file.filename}`
  res.status(201).json({ imageUrl })
})

// Memories
app.get('/memories', (req, res) => {
  const username = req.query.username
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const orderClause = req.query.order === 'desc' ? 'DESC' : 'ASC'

  if (!username) {
    return res.status(403).json({error: 'Need user token'})
  }

  const offset = (page - 1) * limit

  const totalCountQuery = `SELECT COUNT(*) AS count FROM memories INNER JOIN users ON memories.user_id = users.id WHERE users.username = ?`
  const paginatedQuery = `SELECT memories.* FROM memories INNER JOIN users ON memories.user_id = users.id WHERE users.username = ? ORDER BY date ${orderClause} LIMIT ? OFFSET ?`


  db.get(totalCountQuery, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }

    const totalCount = row.count
    const totalPages = Math.ceil(totalCount / limit)

    db.all(paginatedQuery, [username, limit, offset], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }

      res.json({
        memories: rows,
        page,
        limit,
        totalPages,
        totalCount,
      })
    })
  })
})


app.post('/memories', (req, res) => {
  const {username, title, description, date, imageUrl } = req.body

  if (!username || !title || !description || !date || !imageUrl) {
    return res.status(400).json({
      error: 'Please provide all fields: username, title, description, date, imageUrl',
    })
  }

  const userQuery = `SELECT id FROM users WHERE username = ?`
  db.get(userQuery, [username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const stmt = db.prepare(
      'INSERT INTO memories (title, description, date, imageUrl, user_id) VALUES (?, ?, ?, ?, ?)'
    )
    stmt.run(title, description, date, imageUrl, user.id, (err) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      }
      res.status(201).json({ message: 'Memory created successfully' })
    })
  })
})

app.get('/memories/:id', validateParamId, (req, res) => {
  const { id } = req.params
  db.get('SELECT * FROM memories WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    if (!row) {
      res.status(404).json({ error: 'Memory not found' })
      return
    }
    res.json({ memory: row })
  })
})

app.put('/memories/:id', (req, res) => {
  const { id } = req.params
  const { title, description, date } = req.body

  if (!title || !description || !date ) {
    res.status(400).json({
      error:
        'Please provide all fields: title, description, date',
    })
    return
  }

  const stmt = db.prepare(
    'UPDATE memories SET title = ?, description = ?, date = ? WHERE id = ?'
  )
  stmt.run(title, description, date, id, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory updated successfully' })
  })
})

app.delete('/memories/:id', (req, res) => {
  const { id } = req.params
  db.run('DELETE FROM memories WHERE id = ?', [id], (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.json({ message: 'Memory deleted successfully' })
  })
})


// USER
// GET /user
app.get('/user', (req, res) => {
  console.log("sauifsdiuoauio")
  console.log(req.query)

  const { username } = req.query
  console.log(req.query)

  // Prepare the SQL statement
  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  
  // Execute the prepared statement
  stmt.get(username, (err, row) => {
    if (err) {
      console.error(err.message); // It's often a good practice to log the error
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user: row });
  });
});

// POST /user
app.post('/user', (req, res) => {
  const { username, name, description } = req.body

  if (!name || !description) {
    res.status(400).json({ error: 'Please provide both name and description' })
    return
  }

  db.run(
    'INSERT INTO users (username, name, description) VALUES (?, ?, ?)',
    [username, name, description],
    (err) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      res.status(201).json({ message: 'User created successfully' })
    }
  )
})

// PUT /user
app.put('/user', (req, res) => {
  const { name, description } = req.body
  const { username } = req.query
  console.log(username)


  if (!username || !name || !description) {
    res.status(400).json({ error: 'Invalid request' })
    return
  }

  db.run(
    'UPDATE users SET name = ?, description = ? WHERE username = ?',
    [name, description, username],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message })
        return
      }
      return res.json({user:row})
    }
  )
})

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
