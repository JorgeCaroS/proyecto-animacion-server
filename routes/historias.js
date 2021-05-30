const express = require('express');
const router = express.Router();
const Historias = require('../models/historia');



/////Get users

router.get('/', async(req, res) =>{
    try{
        const historias = await Historias.find();
        res.header("Access-Control-Allow-Origin", "*");
        res.json(historias);
        console.log(historias); 
    }catch(err){
        res.status(500).json({message: err.message})
    }
    
})


module.exports = router;
