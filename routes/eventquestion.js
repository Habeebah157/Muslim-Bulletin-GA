const express = require("express");
const router = express.Router();
const authorization = require("../middleware/authorization");
const pool = require("../db.js");



router.post("/", authorization, async (req, res) => {
  try {
    const { event_id, question } = req.body;
    const user_id = req.user.id; // assuming user is set by your auth middleware
    console.log(event_id, question, user_id)

    if (!event_id || !question) {
      return res.status(400).json({ error: "event_id and question are required" });
    }

    const result = await pool.query(
      `INSERT INTO event_questions (event_id, user_id, question)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [event_id, user_id, question]
    );
    res.status(201).json({
        success: true,
        data: result.rows[0]
    });
    // res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error posting question:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /event-questions/:event_id
router.get("/:event_id", async (req, res) => {
  try {
    const { event_id } = req.params;

    const result = await pool.query(
      `SELECT eq.*, u.user_name
       FROM event_questions eq
       JOIN users u ON eq.user_id = u.id
       WHERE eq.event_id = $1
       ORDER BY eq.created_at ASC`,
      [event_id]
    );

    res.status(201).json({
        success: true,
        data: result.rows
    });

  } catch (err) {
    console.error("Error fetching questions:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
// PATCH /event-questions/:id
router.patch("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { question } = req.body;
    const user_id = req.user?.id;

    if (!question) {
      return res.status(400).json({ error: "Question text is required" });
    }

    // 1. Get the existing question
    const existing = await pool.query(
      `SELECT * FROM event_questions WHERE id = $1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const q = existing.rows[0];

    // 2. Check if the user is the owner
    if (q.user_id !== user_id) {
      return res.status(403).json({ error: "You can only edit your own question" });
    }

    // 3. Update the question
    const updated = await pool.query(
      `UPDATE event_questions
       SET question = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [question, id]
    );

    res.status(200).json(updated.rows[0]);
  } catch (err) {
    console.error("Error updating question:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /event-questions/:id
router.delete("/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    // 1. Fetch the question
    const existing = await pool.query(
      `SELECT * FROM event_questions WHERE id = $1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    const q = existing.rows[0];

    // 2. Check ownership
    if (q.user_id !== user_id) {
      return res.status(403).json({ error: "You can only delete your own question" });
    }

    // 3. Delete the question
    await pool.query(
      `DELETE FROM event_questions WHERE id = $1`,
      [id]
    );

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error("Error deleting question:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;