import { Router } from "express";
import Country from "../controllers/country";
import City from "../controllers/city"

export const routes = Router();

routes.get('/getIdWiki', Country.getIdWiki)
routes.get('/countries', Country.getCountries);
routes.post('/country', Country.getCountry)
routes.get('/nearme', City.nearme)
routes.get('/getCity', City.getCity)
