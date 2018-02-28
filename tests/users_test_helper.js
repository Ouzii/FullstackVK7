const Blog = require('../models/blog')
const User = require('../models/user')

const initialUsers = [
    {
        username:"Ouzii",
        name:"Oskari Laaja",
        password:"salainen",
        adult: true
    },
    {
        username:"Ouzii2",
        name:"Oskari Luoja",
        password:"salainen",
        adult: false
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users
  }
  
  module.exports = {
    initialUsers, usersInDb
  }