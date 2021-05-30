const express = require('express');
const router = express.Router();
const Escenarios = require('../models/escenario');



/////Get users

router.get('/', async(req, res) =>{
    try{
        const escenarios = await Escenarios.find();
        res.header("Access-Control-Allow-Origin", "*");
        res.json(escenarios);
        console.log(escenarios); 
    }catch(err){
        res.status(500).json({message: err.message})
    }
    
})


module.exports = router;