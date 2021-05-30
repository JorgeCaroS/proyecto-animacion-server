const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const GridFsStorage = require("multer-gridfs-storage");
const multer = require("multer");
const Grid = require("gridfs-stream");
const crypto = require("crypto");



app.use(cors());
mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.idc3n.mongodb.net/Proyecto?retryWrites=true&w=majority",
  { useNewUrlParser: true ,
   useUnifiedTopology: true }
);
const conn = mongoose.connection;

conn.on("error", (error) => console.error(error));
conn.once("open", () => {
  console.log("Connected to MongoDB");
});

//////////////////////////////
app.use(express.json());



const usersRouter = require("./routes/users");
app.use("/api/users", usersRouter);

const historiasRouter = require("./routes/historias");
app.use("/api/historias", historiasRouter);

const escenariosRouter = require("./routes/escenarios");
app.use("/api/escenarios", escenariosRouter);


////////////////////////////////////////////



////////////////////////////////////////////////

//@route GET Previews
app.get("/image/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json();
    }
    if (file.contentType === "image/jpeg") {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "El formato no es JPG",
      });
    }
  });
});

app.get("/escenario/:filename", (req, res) => {
  gfs2.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json();
    }
    if (file.contentType === "image/jpeg") {
      const readstream = gfs2.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "El formato no es JPG",
      });
    }
  });
});

/////////////////////////////////////////////////////////

////////////////////////////////////////////////
//@route GET Previews
app.get('/historias', async(req, res) =>{
  gfs1.files.find();
  console.log(res)
})

/////////////////////////////////////////////////////////

//@route GET Previews
app.get("/audio/:filename", (req, res) => {
  console.log(req.params.filename)
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    console.log(file)
    if (!file || file.length === 0) {
      return res.status(404).json();
    }
    if (file.contentType === "audio/webm") {
      const readstream = gfs.createReadStream(file.filename);
      
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Formato no válido",
      });
    }
  });
});

/////////////////////////////////////////////////////////

let gfs;
conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("historias");
});

let gfs1;
conn.once("open", () => {
  gfs1 = Grid(conn.db, mongoose.mongo);
  gfs1.collection("historias.files");
});

let gfs2;
conn.once("open", () => {
  gfs2 = Grid(conn.db, mongoose.mongo);
  gfs2.collection("escenarios");
});

// Create Storage Engine

const storage = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads1",
          metadata: "probando"
        };
        resolve(fileInfo);
      });
    });
  },
});


const storage1 = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return new Promise((resolve, reject) => {      
       
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "historias",
          metadata: [{"propietario": req.params.mail , "prueba": req.body.name1} ]    
        };
        resolve(fileInfo);      
    });
  },
});

const storage2 = new GridFsStorage({
  db: conn,
  file: (req, file) => {
    return new Promise((resolve, reject) => {      
       
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "escenarios",
          metadata: [{"propietario": req.params.mail , "prueba": req.body.name1} ]    
        };
        resolve(fileInfo);      
    });
  },
});

//////////////////////////////////////////////////////////////////////

//const upload = multer({ storage }) ;
const upload = multer({ storage }).single("file");
const upload1 = multer({ storage: storage1 }).single("file");
const upload2 = multer({ storage: storage2 }).single("file");
//const upload = multer({ storage }).array("file",10);
/*
app.post("/uploadfile" ,upload.array('file', 12), (req, res) => {
   
    return res.status(200).send(req.files);
}
  
);
*/
///////////////////////////////////

app.post("/uploadfile", async function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    
    console.log(req.file);
    return res.status(200).send(req.file);
  });
});


app.post("/uploadfile1/:mail", async function (req, res) {
  upload1(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.params.mail);
    console.log(req.file);
    console.log(req.body.name1);
    return res.status(200).send(req.file);
  });
});

app.post("/uploadfile2/:mail", async function (req, res) {
  upload2(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    console.log(req.params.mail);
    console.log(req.file);
    console.log(req.body.name1);
    return res.status(200).send(req.file);
  });
});


////////////////////////////////////////////////

app.listen(3000, () => console.log("Server Started "));
