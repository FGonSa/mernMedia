import bcrypt from "bcrypt" //encriptador de password
import jwt from "jsonwebtoken" //tokens JSON para auth
import User from "../models/User.js"

/* REGISTRO DE USER */

//Función async ya que debe conectarse a la BD
//Función para registrar un usuario nuevo
export const register = async (req, res) => {
    try {

        //Destructuring: Obtenemos estos valores del body de la request
      const {
        firstName,
        lastName,
        email,
        password,
        picturePath,
        friends,
        location,
        occupation,
      } = req.body;
  
      //Creamos un salt = una encriptación, una cadena aleatoria
      const salt = await bcrypt.genSalt();

      //Aplicamos el salt al password obtenido
      const passwordHash = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash, //aplicamos el Hash
        picturePath,
        friends,
        location,
        occupation,

        //Dummy Values para este proyecto
        viewedProfile: Math.floor(Math.random() * 10000),
        impressions: Math.floor(Math.random() * 10000),
      });

      //Guardamos el usuario
      const savedUser = await newUser.save();
      res.status(201).json(savedUser); //Status de Usuario creado
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  /*=============================================*/

  /* LOGGING IN */
  //Función para realizar el Login del Usuario
  export const login = async (req, res) => {
    try {
      //Obtenemos los valores del body
      const { email, password } = req.body;

      //Buscamos al usuario en MongoDB a partir de su email
      const user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: "User does not exist. " });
  
      //Comparamos el password encriptado que ha sido enviado con el que figura en la base de datos
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });
      
      // recibe dos argumentos: un objeto con la información que se desea incluir en el token (en este caso, el ID del usuario), 
      //y una clave secreta para firmar el token (en este caso, almacenada en la variable de entorno 
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      delete user.password;
      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };