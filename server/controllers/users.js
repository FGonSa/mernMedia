import User from "../models/User.js";

/* READ */

//Función para encontrar a un usuario
export const getUser = async (req, res) => {
  try {

    //Extraemos el ID de la respuesta y buscamos ese ID
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//Función para encontrar la lista de amigos de un usuario
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    //Vamos a realizar múltiples API calls a la DB
    //Promise.all() para esperar a que todas las promesas generadas por el método map() se resuelvan
    //Por cada ID dentro de friends, buscamos a que usuario se refiere
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    //Formateamos cada amigo para quedarnos con sólo los datos que nos interesan
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

//Función para añadir/eliminar un amigo
//Follow/Unfollow
export const addRemoveFriend = async (req, res) => {
  try {

    //Obtenemos los ID de la respuesta y encontramos los usuarios
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    //Si el amigo ya está en la lista, se deja de seguir
    //Los elementos que no sean iguales a friendId se mantienen en el array y se almacenan de nuevo en user.friends.
    //Lo mismo para friend.friends con el id del user normal
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {

        //Si el amigo no está en la lista, se añade para seguir
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    //Formateamos cada amigo para quedarnos con sólo los datos que nos interesan
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};