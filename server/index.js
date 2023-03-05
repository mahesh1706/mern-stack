import express from 'express';
import bodyParser from 'body-parser';
import mongooose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import {
    fileURLToPath
}
from 'url';
 import { register } from "./controllers/auth.js";
// configration 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginOpenerPolicy({policy :"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit : "30mb", extended : true}));
app.use(bodyParser.urlencoded({ limit : "30mb", extended : true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// file storage

const storage = multer.diskStorage({
    destination : function (req, file,cb)  {
        cb(null, "public/assets");
        },

        filename : function (req, file, cb)  {
            cb(null, file.orginalname);
        }
    });

    const upload = multer({storage});

    // database connection

  const PORT = process.env.PORT || 6001;
  mongooose.connect(process.env.MONGO_URL, { 
    useNewUrlParse:true,
    useUnifiedTopology:true,
  }).then(() => {
    
    app.listen(port, () => console.log('sesrver Port : ${PORT}'));
  })
  .catch((error) =>console.log('${error} did not connect'));


// routes with files
app.post("/auth/register", upload.single("picture"), register);