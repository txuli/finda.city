import type { Request, Response, NextFunction } from "express";
import { Mongoose } from "mongoose";
import Country from "../models/country";
import connection from "../config/db"
import type { CountryType } from "../types/requests";
import {getCountriesFromWiki} from "../wikiQueries/queries"
const getCountries = async (_req: Request, res: Response, next: NextFunction) => {


  try {
    await connection
    const result = await Country.find().lean();
    return res.json(result);
  } catch (error) {
    return res.status(500).send("server errror")
  }
};
const getCountry = async (req: Request, res: Response, next: NextFunction) => {
let country= req.query.country as string
  if (!country) return res.status(430).send("country needed")
  try {
    await connection
    const result = await Country.find({ 'CountryLabel': country.toLocaleLowerCase(), })
    return res.json(result);
  } catch (error) {
    return res.status(500).send("server errror")
  }


}
//endpoint to update the database with wikipedia data
const getIdWiki = async (_req: Request, res: Response, next: NextFunction) => {
  let dbCountries
  let wikiRs = []
  let iso2: string[] = []
  let update

  wikiRs = await getCountriesFromWiki();

  try {

    const wikiByIso = new Map<string, (typeof wikiRs)[number]>();

    wikiRs.forEach(element => {
      const code = element.iso2;
      if (code) {
        wikiByIso.set(code, element);
      }
    });


    const iso2List = Array.from(wikiByIso.keys());

    const filteredDb = await Country.find(
      { iso2: { $in: iso2List } }
    ).sort({ iso2: "asc" });


    for (const dbCountry of filteredDb) {
      const code = dbCountry.iso2;
      if (!code) continue;

      const wiki = wikiByIso.get(code);
      if (!wiki) continue;



      const updates: Record<string, unknown> = {};


      if (!dbCountry.wikiId && wiki.qid) {

        const parts = wiki.qid?.split("/");
        const qid = parts[parts.length - 1] || wiki.qid;
        updates.wikiId = qid;



        if (wiki.lifeExpectancy !== undefined) {
          const wikiLife = Number(wiki.lifeExpectancy);
          if (!Number.isNaN(wikiLife) && dbCountry.lifeExpectancy !== wikiLife) {
            updates.lifeExpectancy = wikiLife;
          }
        }


        if (Object.keys(updates).length === 0) continue;

        const update = await Country.updateOne(
          { iso2: code },
          { $set: updates }
        );


      }
    }

  } catch (error) {
    res.status(200).json(error)
  }
  return res.status(200).json(wikiRs)





}


export default { getCountries, getCountry, getIdWiki }