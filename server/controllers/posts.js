import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */

//Función para crerar un Post
//Obtenemos de la DB al user y la foto que quiere subir
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {}, //empieza con 0 likes
      comments: [], //empieza con 0 comments
    });
    await newPost.save();//guarda el nuevo post

    //Devuelve todos los posts creados para el Feed
    //Feed actualizado con el nuevo post
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */

//Devuelve todos los posts creados para el Feed
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

//Devuelve todos los posts creados por el User
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

//Función para comprobar los Likes
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId); //comprueba si el User ha dado Like a ese Post

    if (isLiked) {
      post.likes.delete(userId);//unLike
    } else {
      post.likes.set(userId, true);//Like
    }

    //Actualizamos post específico
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};