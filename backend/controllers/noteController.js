const pool = require('../config/db');
const logger = require('../config/logger');

const validateNoteInput = (body) => {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const content = typeof body.content === 'string' ? body.content.trim() : '';

  if (!title || !content) {
    return { valid: false, message: 'Title and content are required and cannot be blank.' };
  }

  if (title.length > 255) {
    return { valid: false, message: 'Title must be 255 characters or fewer.' };
  }

  return { valid: true, title, content };
};

exports.getNotes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 100);
    const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM notes WHERE user_id = ?',
      [userId]
    );
    const total = countResult[0].total;

    const [notes] = await pool.query(
      'SELECT id, title, content, created_at, updated_at FROM notes WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );

    res.status(200).json({
      success: true,
      data: notes,
      pagination: {
        total,
        limit,
        offset
      }
    });
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
    const validation = validateNoteInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const [result] = await pool.execute(
      'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)',
      [userId, validation.title, validation.content]
    );

    logger.info({ noteId: result.insertId, userId }, 'Note created successfully');
    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { id: result.insertId, title: validation.title, content: validation.content }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateNote = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const validation = validateNoteInput(req.body);

    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    const [result] = await pool.execute(
      'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?',
      [validation.title, validation.content, id, userId]
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