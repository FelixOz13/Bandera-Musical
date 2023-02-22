const mongoose = require('mongoose')

 const userSchema = mongoose.Schema ({
  username: {
    type: String,
    required: [true, "Agrega tu nombre de Usuario"],
    unique:true
  },

 email: {
    type: String,
   required: [true, "Agrega tu Correo Electronico"],
    unique:true
  },
  password: {
    type: String,
    required:[true, "Agrega tu Contraseña"]
  },
  
},
{
  timestamps:true
})

module.exports = mongoose.model('User', userSchema)