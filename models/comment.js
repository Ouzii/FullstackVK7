const mongoose = require('mongoose')
  
  const Comment = mongoose.model('Comment', {
    content: String,
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
  })

  module.exports = Comment
  