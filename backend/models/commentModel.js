const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
  {
      text: {
    type: String,
    required: true
  },

user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  username: {
    type:  String,
    required: true,
  
  },
  
},

  {
  timestamps: true,
  versionKey: false
  })


module.exports = mongoose.model('Comment', commentSchema)