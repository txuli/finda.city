import { Router } from "express";
import Country from "../controllers/country";
import City from "../controllers/city"

export const routes = Router();

//routes.get('/getIdWiki', Country.getIdWiki)
routes.get('/getCountries', Country.getCountries);
routes.get('/getCountry', Country.getCountry)
routes.get('/nearme', City.nearme)
routes.get('/getCity', City.getCity)
