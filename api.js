import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
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

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      timestamp DATE,
      imageUrl TEXT
    )
  `)
})

app.get('/memories', (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const order = req.query.order === 'desc' ? 'DESC' : 'ASC'

  const offset = (page - 1) * limit

  const totalCountQuery = `SELECT COUNT(*) AS count FROM memories`
  const paginatedQuery = `SELECT * FROM memories ORDER BY timestamp ${order} LIMIT ? OFFSET ?`

  db.get(totalCountQuery, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }

    const totalCount = row.count
    const totalPages = Math.ceil(totalCount / limit)

    db.all(paginatedQuery, [limit, offset], (err, rows) => {
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

// Endpoint to upload an image
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Please provide an image' })
    return
  }

  const imageUrl = `/uploads/${req.file.filename}`
  res.status(201).json({ imageUrl })
})

app.post('/memories', (req, res) => {
  const { title, description, timestamp, imageUrl } = req.body

  if (!title || !description || !timestamp || !imageUrl) {
    res.status(400).json({
      error:
        'Please provide all fields: title, description, timestamp, imageUrl',
    })
    return
  }

  const stmt = db.prepare(
    'INSERT INTO memories (title, description, timestamp, imageUrl) VALUES (?, ?, ?, ?)'
  )
  stmt.run(title, description, timestamp, imageUrl, (err) => {
    if (err) {
      res.status(500).json({ error: err.message })
      return
    }
    res.status(201).json({ message: 'Memory created successfully' })
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
  const { title, description, timestamp, imageUrl } = req.body

  if (!title || !description || !timestamp || !imageUrl) {
    res.status(400).json({
      error:
        'Please provide all fields: title, description, timestamp, imageUrl',
    })
    return
  }

  const stmt = db.prepare(
    'UPDATE memories SET title = ?, description = ?, timestamp = ?, imageUrl = ? WHERE id = ?'
  )
  stmt.run(title, description, timestamp, imageUrl, id, (err) => {
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

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
