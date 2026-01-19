import mongoose from "mongoose";

const countrySchema= new mongoose.Schema(
    {
        CountryLabel:{
            type: String,
            require:true
        },
        country:{
            type: String,
            require:true
        },
        CapitalLabel:{
            type: String,
            require:false
        },
        iso2:{
            type: String,
            require:false
        },
        population:{
            type: Number,
            require:false
        },
        lifeExpectancy:{
            type: Number,
            require:false
        },
        continent:{
            type: String,
            require:false
        },
        lat:{
            type: Number,
            require:true
        },
        lon:{
            type: Number,
            require:true
        },
        fullData:{
            type: Boolean,
            default:false
        },
        wikiId:{
            type: String,
            require:false
        }

    }
)



const Country = mongoose.model("Country", countrySchema, "Countries");


export default Country;