import { createSlice } from "@reduxjs/toolkit";

/* r e d u x
===========
E S T A D O
G L O B A L
===========
*/


//Estado inicial
// Modo Luz, no Dark Mode
//No existe user ni posts ni token
const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
};

/*
Slice con el estado del Auth
Reducers = Funciones con las acciones que vamos a realizar
*/
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    //Función para cambiar de Light Mode a Dark Mode
    //Recibe un state y trabaja con su atributo "mode".
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },

    //action es un objeto que contiene información sobre la acción que se está realizando. 
    //En este caso, se espera que action tenga una propiedad payload que contenga un objeto con las propiedades user y token.
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    //Función para hacer Logout, los valores pasan a null
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },

    //Función para setear los amigos de un user, coge el valor de un payload
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },

    //Función que sirve para indicarle al state los posts
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },

    //Función para actualizar un post dentro del estado global
    //Empieza mapeando el array de posts 
    //Por cada post en el array, la función comprueba si el _id del post es igual al _id del post en action.payload.post.
    //Si coincide, se actualiza el post. Si no coincide, se devuelve el post original sin modificar.
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      //La propiedad state.posts se actualiza con la nueva array de posts updatedPosts que se acaba de crear.
      state.posts = updatedPosts;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setPosts, setPost } =
  authSlice.actions;
export default authSlice.reducer;
