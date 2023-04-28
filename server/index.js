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
MIDDLEWARES
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
FILE STORAGE
==============
*/