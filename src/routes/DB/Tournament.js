import express from "express";
import _Dirname from "../../../utils.js";
import { authToken  } from "../../../utils.js";

import modelTournament from "../../models/modelTournament.js";

const TournamentDB = express.Router();
TournamentDB.use(express.json());
TournamentDB.use(express.static(_Dirname + "/src/public"));

TournamentDB.post("/:Id/CreateTournament", authToken("jwt") ,async (req,res) => {

    let Id = req.params.Id;
    let {body} = req;

    let Tournament = {
        owner: Id,
        ...body
    }

    let result = await modelTournament.create(Tournament);
    
    console.log(result);

    res.status(200).json("el torneo ha sido creado por el club " + Id);
    
})

export default TournamentDB;