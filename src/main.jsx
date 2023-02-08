import React from "react";
import ReactDOM from "react-dom/client";

/*IMPORTAMOS EL ENRUTADOR DE NAVEGADOR*/
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

/* IMPORTAMOS ESTILOS */
import "./index.css";

/* ESTABLECEMOS ERRORPAGE COMO RUTA RAIZ A ERRORES */
import ErrorPage from "./error-page";

/* IMPORTAMOS EL COMPONENTE DE CONTACTO */
import Contact,{  loader as contactLoader, action as contactAction, } from "./routes/contact";

/* ESTABLECEMOS ROOT COMO RUTA RAIZ */
import Root, { loader as rootLoader, action as rootAction,} from "./routes/root";

/* IMPORTAMOS RUTA DE EDICIÓN*/
import EditContact, {  action as editAction, } from "./routes/edit";

/* IMPORTAMOS LA DESTRUCCIÓN */
import { action as destroyAction } from "./routes/destroy";

/* IMPORTAMOS LA RUTA ÍNDICE */
import Index from "./routes/index";

/* RENDERIZAMOS EL ENRUTADOR DEL NAVEGADOR */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, /* A ESTO SE REFIERE CON LO DE ESTABLECER LA RUTA RAIZ */
    errorElement: <ErrorPage />, /* A ESTO SE REFIERE CON LO DE ESTABLECER ERRORES A LA RUTA RAIZ */
    loader: rootLoader,
    action: rootAction,

    /* HACEMOS CONTACTOS UNA RUTA SECUNDARIA */
    /* PODREMOS DESTRUIR, VER Y EDITAR */
    /* AÑADIMOS ÍNIDCE */
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Index /> },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            // MENSAJE CONTEXTUAL PARA DESTRUCCIÓN
            errorElement: <div>Oops! There was an error.</div>,
          },
          {
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader,
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
        ],
      },
    ],
  },
]);

/* RENDERIZAMOS */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);