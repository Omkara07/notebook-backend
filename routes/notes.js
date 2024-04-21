const express = require("express");
const router = express.Router();
const Notes = require("../models/Notes");
const fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1 : Get all Notes GET '/api/notes/getallnotes'.
router.get("/getallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

// Route 2 : Add a note POST '/api/notes/addnote'.
router.post(
  "/addnote",
  fetchuser,
  [
    // Validating entry fields
    body("title", "enter a valid title").isLength({ min: 2 }),
    body(
      "description",
      "description must contain atleast 8 characters"
    ).isLength({ min: 8 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // return if its a bad request
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const userId = req.user.id;
      const note = new Notes({
        title,
        description,
        tag,
        user: userId,
      });
      const savednotes = await note.save();

      res.send(savednotes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server error");
    }
  }
);

// Route 3 : Update a note PUT '/api/notes/updatenote/:id'.
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  // destructuring
  const { title, description, tag } = req.body;

  try {
    // create a new note
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // find the note to be update
    let note = await Notes.findById(req.params.id);
    // if the note is not found
    if (!note) {
      return res.status(404).send("Not found");
    }
    // if the user who is updating the note is not the owner of the note return NOT ALLOWED
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    // update the note
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

// Route 4 : Delete a note DELETE '/api/notes/updatenote/:id'.
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    // find the note to be update
    let note = await Notes.findById(req.params.id);
    // if the note is not found
    if (!note) {
      return res.status(404).send("Not found");
    }
    // if the user who is updating the note is not the owner of the note return NOT ALLOWED
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ success: "note deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

module.exports = router;
