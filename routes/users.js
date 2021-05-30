const express = require('express');
const router = express.Router();
const Users = require('../models/user');



/////Get users

router.get('/', async(req, res) =>{
    try{
        const users = await Users.find();
        res.header("Access-Control-Allow-Origin", "*");
        res.json(users);
        console.log(users); 
    }catch(err){
        res.status(500).json({message: err.message})
    }
    
})

/////Get One product
router.get('/:mail',getUser,(req, res) => {
    res.json([{user:res.users.name},{mail:res.users.mail},{phone:res.users.phone}]);
  });

/////Create One user

router.post('/registrarse', async(req, res) =>{
  //  console.log(req.body);      
    const users = new Users({
        name: req.body.name, 
        lastname: req.body.lastname, 
        //password: req.body.password, 
        mail: req.body.mail,   
        phone: req.body.phone,          
                             
    })
    users.password = users.generateHash(req.body.password); 
    try{  
        console.log("Request" + JSON.stringify(req.body))            
        const newUsers = await users.save();
        console.log(newUsers);
        res.status(201).json(newUsers);

    }catch(err){
        res.status(400).json({err: err.message});
    }

})

router.post('/login', function(req, res) {
    Users.findOne({username: req.body.username}, function(err, user) {
  
      if (!user.validPassword(req.body.password)) {
        console.log("No Coinciden")
        res.status(400).json();
      } else {        
        console.log(user)
        res.send(user)
        //res.status(201).json();
      }
    });
  });


/////Update One product
router.patch('/:id',getUsers, async(req, res) =>{
    if(req.body.name1 != null){
        res.users.name1 = req.body.name1
    }
   
    try{
        const updatedUser = await res.users.save()
        res.json(updatedUser)

    } catch(error){

        res.status(400).json({message: err.message})
    }
    

})



/////Delete One product
router.delete('/:id',getUsers, (req, res) =>{
    try{
        res.users.remove().users;
        res.json({message:"Usuario Eliminado"})

    } catch(error){
        res.status(500).json({message: err.message})
    }

})


async function getUsers(req, res, next) {
    let users
  try {
    users = await Users.findById(req.params.id);
    if (users == null) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }
  } catch (err) {
      return res.status(500).json({message: err.message})
  }
  res.users = users;
  next();
}

async function getUser(req, res, next) {
    let users
  try {
    users = await Users.findOne({mail:req.params.mail});
    if (users == null) {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }
  } catch (err) {
      return res.status(500).json({message: err.message})
  }
  res.users = users;
  next();   
}

module.exports = router;
