const asyncHandler = require('express-async-handler')

const Comment = require('../models/commentModel')
const User = require('../models/userModel')



// @desc    Get comments
// @route   GET /api/comments
// @access  Private
const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ })

  res.status(200).json(comments)
})



// @desc    Set comment
// @route   POST /api/comments
// @access  Private
const setComment = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400)
    throw new Error('Please add a text field')
  }
  
  const comment = await Comment.create({
    text: req.body.text,
    user: req.user.id,
    username: req.user.username
  })

  res.status(200).json(comment)
})




// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    res.status(400)
    throw new Error('Ne se Encontro el Comentario')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('Usuario no Encontrado')
  }

  // Make sure the logged in user matches the comment user
  if (comment.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Usuario no autorizado')
  }

  const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  res.status(200).json(updatedComment)
})

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id)

  if (!comment) {
    res.status(400)
    throw new Error('No se Encontro el Comentario')
  }

  // Check for user
  if (!req.user) {
    res.status(401)
    throw new Error('No se Encontro el Usuario')
  }

  // Make sure the logged in user matches the comment user
  if (comment.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('Usuario no Autorizado')
  }

  await comment.remove()

  res.status(200).json({ id: req.params.id })
})

module.exports = {
  getComments,
  setComment,
  updateComment,
  deleteComment,
}