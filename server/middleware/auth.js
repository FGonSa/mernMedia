import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {

    //Cogemos el token del header
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    //Suprimimos "Bearer" del token
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    //Verificamos
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

    //Nos permite pasar al siguiente paso en caso de que la ruta se esté protegiendo con token
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};