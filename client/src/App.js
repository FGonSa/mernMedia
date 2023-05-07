import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {

  //Función de Redux: se encarga de extraer datos del store global de Redux
  //se está extrayendo el valor de state.mode
  //state.mode = indica qué modo actual tiene la app (light o dark)
  const mode = useSelector((state) => state.mode);

  //Memorizamos el objeto 'theme' para no tener que calcularlo cada vez.
  //La función createTheme de MUI toma los valores del fichero Theme para crear los colores del theme.
  //Dependencias: mode. significa que si el valor de mode cambia, se volverá a crear el objeto theme
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  //Obtenemos el token del State de Redux
  //La función Boolean sirve para devolver un true o un false
  //Si obtenemos true, navegaremos a las rutas permitidas.
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}> {/*Esto renderiza el Theme*/} 
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
