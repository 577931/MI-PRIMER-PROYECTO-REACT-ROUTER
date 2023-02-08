/* DISEÑO GLOBAL DE LA APLIACIÓN, RUTA RAIZ */
import { 
  Outlet, /* IMPORTAMOS LA REPRESENTACIÓN DE RUTAS SECUNDARIAS */
  NavLink, 
  useLoaderData, /* IMPORTAMOS LOS DATOS DE CONTACTO */
  Form, /* IMPORTAMOS FORM PARA LA CREACIÓN DE CONTACTOS POR FORMULARIO */
  redirect, /* IMPORTAMOS REDIRECCIÓN */
  useNavigation, /* IMORTAMOS INTERFAZ DE USUARIO PENDIENTE GLOBAL, DEVUELVE ESTADO DE NAVEGACIÓN  "idle" | "submitting" | "loading"*/
  useSubmit, /* PARÁMTRO PARA EL SUBMIT */
} from "react-router-dom";

/* IMPORTAMOS UN CARGADOR Y CREADOR DE DATOS DE CONTACTO */
import { getContacts, createContact } from "../contacts";

/* IMPORTAMOS EL VALOR DE ENTRADA CON LOS PARÁMETROS DE BÚSQUEDA URL */
import { useEffect } from "react";

/* EXPORTAMOS CREACIÓN DE CONTACTOS */
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

/* EXPORTAMOS EL CARGADOR DE DATOS DE CONTACTO */
/* SERÁ EL QUE NOS AYUDE CON LAS BÚSQUEDAS */
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  /* DECLARAMOS CONTACTOS */
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation(); /* AGREGAMOS INTERFAZ DE USUARIO PENDIENTE GLOBAL */
  const submit = useSubmit();
  
  /* AGREGAMOS SELECTOR DE BÚSQUEDA */
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);

  return (
    /* 
    * NOTA
    * <Form> evita el comportamiento predeterminado del navegador de enviar una nueva 
    * solicitud POST al servidor, pero en su lugar emula el navegador creando una solicitud 
    * POST con enrutamiento del lado del cliente.
    * 
    * Coincide <Form action="destroy">con la nueva ruta "contacts/:contactId/destroy" y 
    * le envía la solicitud.
    * 
    * Después de que la acción redirige, React Router llama a todos los cargadores de datos 
    * en la página para obtener los valores más recientes (esto es "revalidación"). 
    * useLoaderDatadevuelve nuevos valores y hace que los componentes se actualicen.
    */
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={(event) => {
                const isFirstSearch = q == null;
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? ( /* RENDERIZAMOS LOS CONTACTOS */
            <ul>
              {contacts.map((contact) => (
                /* CON LINK O NAVLINK ENRUTAMOS EN EL CLIENTE, ASÍ LA PÁGINA SE VUELVE SPA */
                <li key={contact.id}>
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                          ? "pending"
                          : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={
        navigation.state === "loading" ? "loading" : ""
      }
      /* REPRESENTAMOS RUTAS SECUNDARIAS CON OUTLET, POR EJEMPLO CONTACTO */
      >
        <Outlet /> 
      </div>
    </>
  );
}