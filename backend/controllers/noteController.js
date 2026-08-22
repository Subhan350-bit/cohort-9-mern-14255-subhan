const pool = require('../config/db');
const logger = require('../config/logger');

exports.getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const [notes] = await pool.execute(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC',
      [userId]
    );

    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    next(error);
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [notes] = await pool.execute(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (notes.length === 0) {
      return res.status(404).json({ success: false, message: 'Note not found.' });
    }

    res.status(200).json({ success: true, data: notes[0] });
  } catch (error) {
    next(error);
  }
};

exports.createNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const [result] = await pool.execute(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [userId, title, content]
    );

    logger.info({ noteId: result.insertId, userId }, 'Note created successfully');
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { id: result.insertId, title, content }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required.' });
    }

    const [result] = await pool.execute(
      'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [title, content, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized.' });
    }

    logger.info({ noteId: id, userId }, 'Note updated successfully');
    res.status(200).json({ success: true, message: 'Note updated successfully.' });
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM notes WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Note not found or unauthorized.' });
    }

    logger.info({ noteId: id, userId }, 'Note deleted successfully');
    res.status(200).json({ success: true, message: 'Note deleted successfully.' });
  } catch (error) {
    next(error);
  }
};