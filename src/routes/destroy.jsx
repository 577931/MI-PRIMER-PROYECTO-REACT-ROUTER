/* ELIMINACIÓN DE DATOS */
import { redirect } from "react-router-dom";
import { deleteContact } from "../contacts";

export async function action({ params }) {
  //throw new Error("DAMMM BRO!"); //ARROJAMOS UN ERROR PROPIO
  await deleteContact(params.contactId);
  return redirect("/");
}