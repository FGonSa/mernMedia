import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

/* CONFIGURATIONS */
/*
Middleware = Funciones que actúan en medio de Requests
Un middleware es una función que procesa una solicitud HTTP antes de que sea manejada por el controlador correspondiente.
*/

//Un Module es un File que vamos a exportar/importar
//Convierte la URL del archivo actual en una ruta de archivo en el sistema
const __filename = fileURLToPath(import.meta.url); 

//hace referencia al directorio en el que se encuentra el archivo actual
const __dirname = path.dirname(__filename);

// busca el archivo .env en la raíz del proyecto y carga todas las variables de entorno definidas en el archivo
dotenv.config();

//Instancia de Express
const app = express();

/*
==============
MIDDLEWARES EXPRESS: Preparando las solicitudes HTTP
==============
*/

//Sin esta función tendríamos que escribir nuestro propio código para analizar los datos JSON en el cuerpo de la solicitud, lo que requeriría más tiempo y esfuerzo para implementar.
app.use(express.json());

//Mejora la seguridad de la aplicación web al establecer varios encabezados HTTP relacionados con la seguridad
//Evita inyecciones y ataques
app.use(helmet());

//se indica que los recursos en la respuesta HTTP pueden ser cargados desde cualquier origen
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//para registrar información de solicitud en la consola de la terminal
app.use(morgan("common"));

//se utiliza para analizar las solicitudes HTTP entrantes con datos en formato JSON
//La opción limit se utiliza para limitar el tamaño máximo del cuerpo de la solicitud, mientras que la opción extended se utiliza para permitir datos codificados complejos
app.use(bodyParser.json({ limit: "30mb", extended: true }));

//se habilita la capacidad de analizar automáticamente los datos codificados en formato x-www-form-urlencoded en el cuerpo de una solicitud entrante
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

//cuando se recibe una solicitud HTTP para la ruta /assets, la aplicación responderá devolviendo el archivo correspondiente del directorio "public/assets"
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


/*
==============
FILE STORAGE: Subir y bajar ficheros
==============
*/

//Objeto Storage
//La función destination especifica el directorio donde se almacenarán los archivos subidos, en este caso, la carpeta "public/assets"
//La función filename especifica el nombre del archivo cuando se guarda y se utiliza el nombre original del archivo subido.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  //Definimos objeto Upload con la función multer y le pasamos Storage como parámetro
  //el middleware utiliza el objeto storage para guardar el archivo en el directorio especificado y con el nombre especificado
  const upload = multer({ storage });

 /*
==============
MONGOOSE SETUP
==============
*/

//Conexión con el Puerto que hay en ENV o en su defecto 6001
const PORT = process.env.PORT || 6001;

//Conexión MONGO DB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

    /*
==============
RUTAS
==============
*/

//maneja una solicitud de registro de usuario y espera recibir un archivo con el nombre picture en la solicitud. 
//El middleware upload.single() se utiliza para manejar la carga de un solo archivo con el nombre especificado. 
//Después de que el archivo se carga con éxito, se llama a la función register() para procesar la solicitud.
app.post("/auth/register", upload.single("picture"), register);

//maneja una solicitud para crear un nuevo post y espera recibir un archivo con el nombre picture en la solicitud, junto con un token de autenticación.
//Después de que el archivo se carga con éxito y se verifica el token, se llama a la función createPost() para procesar la solicitud.
app.post("/posts", verifyToken, upload.single("picture"), createPost);


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);