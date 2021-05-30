const mongoose = require("mongoose");


const historiaSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: false,
  },    
  metadata: [{
    propietario: String,
    prueba: String,
    
  }],   
  
});


module.exports = mongoose.model("historias.files", historiaSchema);