import { Types } from "mongoose";
export interface response {
    lat:number
    lon:number
}
export interface Filter { 
    country?: Types.ObjectId, 
    cityLabel?: string, 
    population?: 
    { 
        $gte?: number; $lte?: number 
    } 
}
export interface CountryType{

}

export interface SparqlValue {
  value: string;
}


export interface CountryRow {
  qid: string;                  
  countryLabel?: string;
  capitalLabel?: string;
  iso2: string;
  lat?: number;
  lon?: number;
  continentLabel?: string;
  population?: number;
  lifeExpectancy?: number;
}

export interface CityRow {
  qid: string;                  
  cityLabel: string;
  countryLabel?: string;
  population?: number;
  lat?: number;
  lon?: number;
}
export interface SparqlValue {
  type: "uri" | "literal" | "bnode";
  value: string;
  "xml:lang"?: string;
  datatype?: string;
}

export interface Binding {
  [variableName: string]: SparqlValue | undefined;
}

export interface SparqlResponse {
  head: { vars: string[] };
  results: { bindings: Binding[] };
}
