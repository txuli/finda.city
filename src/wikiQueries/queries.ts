import type { SparqlResponse, CountryRow, CityRow } from "../types/requests";
const endpointUrl = "https://query.wikidata.org/sparql";

/**
 * Helper genérico: ejecuta una query SPARQL y devuelve la respuesta cruda.
 */
async function fetchSparql(query: string): Promise<SparqlResponse> {
  const url = `${endpointUrl}?query=${encodeURIComponent(query)}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/sparql-results+json",
      "User-Agent": "BunWikidataBot/1.0 (https://example.org/; example@example.org)"
    }
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("SPARQL error:", res.status, res.statusText);
    console.error(text);
    throw new Error(`SPARQL request failed: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as SparqlResponse;
}







function buildCountriesQuery(): string {
  return `
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX psv: <http://www.wikidata.org/prop/statement/value/>
PREFIX bd: <http://www.bigdata.com/rdf#>

SELECT ?country ?countryLabel ?capitalLabel ?iso2 ?lat ?lon ?continentLabel
       (SAMPLE(?population) AS ?population)
       (SAMPLE(?lifeExpectancy) AS ?lifeExpectancy)
WHERE {
  {
    SELECT ?country ?lat ?lon WHERE {
      ?country wdt:P31 wd:Q6256 .           # instancia de país
      FILTER NOT EXISTS { ?country wdt:P576 ?endDate . }  # no países extinguidos

      ?country p:P625 ?st .
      ?st psv:P625 ?v .
      ?v wikibase:geoLatitude ?lat ;
         wikibase:geoLongitude ?lon ;
         wikibase:geoPrecision ?prec .
    }
    ORDER BY DESC(?prec)
  }

  OPTIONAL { ?country wdt:P36 ?capital . }
  ?country wdt:P297 ?iso2 .                   # solo países con ISO2
  OPTIONAL { ?country wdt:P30 ?continent . }
  OPTIONAL { ?country wdt:P1082 ?population . }
  OPTIONAL { ?country wdt:P2250 ?lifeExpectancy . }

  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,en" . }
}
GROUP BY ?country ?countryLabel ?capitalLabel ?iso2 ?lat ?lon ?continentLabel
ORDER BY ASC(?iso2)
`;
}

function buildCityQuery(countryQid: string, cityName: string): string {

  return `
PREFIX wikibase: <http://wikiba.se/ontology#>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX bd: <http://www.bigdata.com/rdf#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX p: <http://www.wikidata.org/prop/>
PREFIX psv: <http://www.wikidata.org/prop/statement/value/>

SELECT ?city ?cityLabel ?population ?lat ?lon ?countryLabel
WHERE {
  # País: España
  BIND(wd:${countryQid} AS ?country)

  # Ciudad / pueblo
  ?city rdfs:label "${cityName}"@en ;
        wdt:P17 ?country .

  OPTIONAL { ?city wdt:P1082 ?population . }

  OPTIONAL {
    ?city p:P625 ?coordStatement .
    ?coordStatement psv:P625 ?coordNode .
    ?coordNode wikibase:geoLatitude ?lat ;
               wikibase:geoLongitude ?lon .
  }

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en,en" .
  }
}limit 1

`;
}


export async function getCountriesFromWiki(): Promise<CountryRow[]> {
  const query = buildCountriesQuery();
  const res = await fetchSparql(query);

  return res.results.bindings.map((b): CountryRow => {
    const countryUri = b.country?.value ?? "";
    const qid = countryUri.split("/").pop() ?? countryUri;

    return {
      qid,
      countryLabel: b.countryLabel?.value,
      capitalLabel: b.capitalLabel?.value,
      iso2: b.iso2?.value ?? "",
      lat: b.lat ? Number(b.lat.value) : undefined,
      lon: b.lon ? Number(b.lon.value) : undefined,
      continentLabel: b.continentLabel?.value,
      population: b.population ? Number(b.population.value) : undefined,
      lifeExpectancy: b.lifeExpectancy ? Number(b.lifeExpectancy.value) : undefined
    };
  });
}


export async function getCityFromWiki(
  countryQid: string,
  cityName: string
): Promise<CityRow | null> {
  const query = buildCityQuery(countryQid, cityName);
  const res = await fetchSparql(query);

  const binding = res.results.bindings[0];
  if (!binding) return null;

  const cityUri = binding.city?.value ?? "";
  const qid = cityUri.split("/").pop() ?? cityUri;

  const cityLabel = binding.cityLabel?.value ?? cityName;

  return {
    qid,
    cityLabel,
    countryLabel: binding.countryLabel?.value,
    population: binding.population ? Number(binding.population.value) : undefined,
    lat: binding.lat ? Number(binding.lat.value) : undefined,
    lon: binding.lon ? Number(binding.lon.value) : undefined
  };
}
