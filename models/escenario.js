const mongoose = require("mongoose");


const escenarioSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: false,
  },    
  metadata: [{
    propietario: String,
    prueba: String,
    
  }],   
  
});


module.exports = mongoose.model("escenarios.files", escenarioSchema);