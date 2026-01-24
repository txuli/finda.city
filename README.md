# Finda.city API

A RESTful API for discovering countries and cities worldwide, with geolocation features and Wikipedia data integration.

## Overview

Finda.city is a geographic data API that provides information about countries and cities around the world. It features IP-based geolocation, proximity search, and integrates with Wikipedia to provide enriched data about locations.

## Features

- 🌍 **Country Information**: Get data about countries including population, life expectancy, coordinates, and capital cities
- 🏙️ **City Search**: Find cities by name, country, or population range
- 📍 **Proximity Search**: Find nearby cities based on IP geolocation
- 📊 **Wikipedia Integration**: Automatically enriches data with information from Wikidata
- 🗄️ **MongoDB Database**: Efficient data storage with geospatial indexing
- ⚡ **Built with Bun**: Fast runtime and package management

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Language**: TypeScript
- **Geolocation**: MaxMind

## API Endpoints

### Health Check
```
GET /health
```
Returns the health status of the API.

**Response:**
```json
{
  "ok": true
}
```

### Countries

#### Get All Countries
```
GET /countries
```
Returns a list of all countries in the database.

**Response:**
```json
[
  {
    "CountryLabel": "spain",
    "country": "Spain",
    "CapitalLabel": "Madrid",
    "iso2": "ES",
    "population": 47450795,
    "lifeExpectancy": 83.2,
    "continent": "Europe",
    "lat": 40.4,
    "lon": -3.7,
    "wikiId": "Q29"
  }
]
```

#### Get Country by Name
```
POST /country
```
Get information about a specific country.

**Request Body:**
```json
{
  "country": "spain"
}
```

**Response:**
```json
[
  {
    "CountryLabel": "spain",
    "country": "Spain",
    "CapitalLabel": "Madrid",
    "iso2": "ES",
    "population": 47450795,
    "lifeExpectancy": 83.2,
    "continent": "Europe",
    "lat": 40.4,
    "lon": -3.7,
    "wikiId": "Q29"
  }
]
```

#### Update Countries from Wikipedia
```
GET /getIdWiki
```
Admin endpoint to update country data from Wikidata (life expectancy, wiki IDs, etc.).

### Cities

#### Get Cities Near You
```
GET /nearme
```
Returns the 5 closest cities to your current location based on your IP address.

**Response:**
```json
[
  {
    "city": "Madrid",
    "cityLabel": "madrid",
    "country": "507f1f77bcf86cd799439011",
    "location": {
      "type": "Point",
      "coordinates": [-3.7038, 40.4168]
    },
    "population": 3223334
  }
]
```

#### Search Cities
```
GET /getCity
```
Search for cities by name, country, and/or population range.

**Query Parameters:**
- `city` (string): City name (case-insensitive)
- `country` (string): Country name (case-insensitive)
- `minPopulation` (number): Minimum population
- `maxPopulation` (number): Maximum population

**Example:**
```
GET /getCity?city=madrid&country=spain
GET /getCity?minPopulation=1000000&maxPopulation=5000000
```

**Response:**
```json
[
  {
    "city": "Madrid",
    "cityLabel": "madrid",
    "country": "507f1f77bcf86cd799439011",
    "location": {
      "type": "Point",
      "coordinates": [-3.7038, 40.4168]
    },
    "population": 3223334
  }
]
```

## Installation

### Prerequisites
- [Bun](https://bun.sh) installed
- MongoDB instance running
- Redis instance running (optional, for caching)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/txuli/finda.city.git
cd finda.city
```

2. Install dependencies:
```bash
bun install
```

3. Configure environment variables (create a `.env` file):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/finda
REDIS_URL=redis://localhost:6379
```

4. Start the server:
```bash
bun run src/index.ts
```

The API will be running at `http://localhost:3000`

## Data Models

### Country Schema
```typescript
{
  CountryLabel: string,      // Lowercase country name
  country: string,           // Capitalized country name
  CapitalLabel: string,      // Capital city name
  iso2: string,              // ISO 3166-1 alpha-2 code
  population: number,        // Country population
  lifeExpectancy: number,    // Life expectancy in years
  continent: string,         // Continent name
  lat: number,              // Latitude
  lon: number,              // Longitude
  fullData: boolean,        // Data completeness flag
  wikiId: string            // Wikidata ID (e.g., "Q29")
}
```

### City Schema
```typescript
{
  city: string,              // City name
  cityLabel: string,         // Lowercase city name
  country: ObjectId,         // Reference to Country
  location: {
    type: "Point",
    coordinates: [number, number]  // [longitude, latitude]
  },
  population: number         // City population
}
```

## Development

The project structure:
```
finda.city/
├── src/
│   ├── index.ts           # Entry point
│   ├── config/
│   │   └── db.ts         # Database configuration
│   ├── controllers/
│   │   ├── city.ts       # City endpoints logic
│   │   └── country.ts    # Country endpoints logic
│   ├── models/
│   │   ├── city.ts       # City schema
│   │   └── country.ts    # Country schema
│   ├── routes/
│   │   └── index.ts      # API routes
│   ├── types/
│   │   └── requests.ts   # TypeScript types
│   └── utils/
└── wikiQueries/
    └── queries.ts         # Wikipedia/Wikidata integration
```


