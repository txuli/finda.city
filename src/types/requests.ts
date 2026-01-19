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

export interface Binding {
  country: SparqlValue;
  countryLabel?: SparqlValue;
  capitalLabel?: SparqlValue;
  iso2?: SparqlValue;
  lat?: SparqlValue;
  lon?: SparqlValue;
  continentLabel?: SparqlValue;
  population?: SparqlValue;
  lifeExpectancy?: SparqlValue;
}

export interface SparqlResponse {
  results: { bindings: Binding[] };
}