  const mongoose = require("mongoose");
  var bcrypt = require('bcrypt');

  const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: false,
    },    
    mail: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },  
    password: {
      type: String,
      required: false,
    },
    pruebas: [
        {historia:String,
            
      }
    ]
    
  });

  // hash the password
  userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  // checking if password is valid
  userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  module.exports = mongoose.model("Users", userSchema);