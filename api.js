import express from 'express'
import sqlite3 from 'sqlite3'

const app = express()
const port = 4001
const db = new sqlite3.Database('memories.db')

import { validateParamId } from './api.validators.js'

app.use(express.json())

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      timestamp DATE
    )
  `)
})

app.get('/memories', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const totalCountQuery = 'SELECT COUNT(*) AS count FROM memories';
  const paginatedQuery = `SELECT * FROM memories LIMIT ? OFFSET ?`;

  db.get(totalCountQuery, (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const totalCount = row.count;
    const totalPages = Math.ceil(totalCount / limit);

    db.all(paginatedQuery, [limit, offset], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({
        memories: rows,
        page,
        limit,
        totalPages,
        totalCount
      });
    });
  });
});

app.post('/memories', (req, res) => {
  const { name, description, timestamp } = req.body

  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    })
    return
  }

  const stmt = db.prepare(
    'INSERT INTO memories (name, description, timestamp) VALUES (?, ?, ?)'
  )
  stmt.run(name, description, timestamp, (err) => {
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
  const { name, description, timestamp } = req.body

  if (!name || !description || !timestamp) {
    res.status(400).json({
      error: 'Please provide all fields: name, description, timestamp',
    })
    return
  }

  const stmt = db.prepare(
    'UPDATE memories SET name = ?, description = ?, timestamp = ? WHERE id = ?'
  )
  stmt.run(name, description, timestamp, id, (err) => {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
