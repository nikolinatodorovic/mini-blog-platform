
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');


// POST /api/posts/:id/comments - Kreiranje novog komentara za post
router.post('/posts/:id/comments', commentController.createComment); 

// GET /api/posts/:id/comments - Dobijanje svih komentara za post
router.get('/posts/:id/comments', commentController.getComments); 

// PUT /api/posts/:id/comments/:commentId - Ažuriranje komentara
router.put('/posts/:id/comments/:commentId', commentController.updateComment); 

// DELETE /api/posts/:id/comments/:commentId - Brisanje komentara
router.delete('/posts/:id/comments/:commentId', commentController.deleteComment); 

module.exports = router;
