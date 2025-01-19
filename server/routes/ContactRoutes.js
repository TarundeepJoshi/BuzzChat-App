import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import {
  getAllContacts,
  getContactsForDMList,
  searchContacts,
} from "../controllers/ContactsController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);
contactsRoutes.get("/getContactsForDMList", verifyToken, getContactsForDMList);
contactsRoutes.get("/getAllContacts", verifyToken, getAllContacts);

export default contactsRoutes;
