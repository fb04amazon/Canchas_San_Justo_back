import  express  from "express";
import _Dirname from "../../../utils.js";
import fs from "fs";

import { authToken, TypeUserCheck } from "../../../utils.js";
import modelCourts from "../../models/modelCourts.js";

import { uploader } from "../../../utils.js";
import { email } from "./mail.js";


const CourtsDB = express.Router();
CourtsDB.use(express.json());
CourtsDB.use(express.static(_Dirname + "/src/public"));


CourtsDB.post( "/Post_dbproduct/:clubId", TypeUserCheck(), async (req, res) => {

        const {body} = req;
        let clubId = req.params.clubId;
        let title = req.body.title;
       
        console.log(_Dirname + "/src/public/clubs/" + req.user.id + "/courts/" + title)

        fs.mkdirSync(_Dirname + "/src/public/clubs/" + req.user.id + "/courts/" + title, { recursive: true });
        fs.mkdirSync(_Dirname + "/src/public/clubs/" + req.user.id + "/courts/" + title + "/images", { recursive: true });
        fs.mkdirSync(_Dirname + "/src/public/clubs/" + req.user.id + "/courts/" + title + "/videos", { recursive: true });
        fs.mkdirSync(_Dirname + "/src/public/clubs/" + req.user.id + "/courts/" + title + "/documents", { recursive: true });
        
        const producto = {
            club_owner: clubId,
            ...body

        }

        const result = await modelCourts.create(producto);

        res.status(201).json(result)

});

CourtsDB.get("/Get_dbproduct/:clubId/:courtTitle", authToken('jwt'), async (req,res) => {

    const find = await modelCourts.find({club_owner: req.params.clubId}).lean();

    let result = find.filter(element => element.title === req.params.courtTitle);

    console.log(result)

    res.status(200).json(result[0]);
});

CourtsDB.put( "/Put_dbproduct/:id", TypeUserCheck(), async (req,res) => {

    const { params : { id }, body} = req;

    let user = req.user;

    
    if(user.typeUser === "premium" && body.owner === user.id){

        await modelCourts.updateOne( {_id: id}, {$set: body});

        res.status(204).send("producto actualizado por el admin")

    }else if(user.typeUser === "admin"){

        await modelCourts.updateOne( {_id: id}, {$set: body});

        res.status(204).send("producto actualizado por el dueño del producto")

    }else if(user.typeUser === "premium" && body.owner !== user.id){

        res.status(404).send("el usuario no puede modificar un producto que no es suyo")

    }

});

CourtsDB.delete( "/Delete_dbproduct/:id", TypeUserCheck(), async (req,res) => {

    let user = req.user;

        const { params: {id} } = req;

        let producto = await modelCourts.findById(id);

        if(user.typeUser === "admin" && producto.owner === "admin"){

            await modelCourts.deleteOne({_id: id});

            console.log("admin ha eliminado producto de admin");

            res.status(204).json("producto eliminado por el admin");
        }
        else if(user.typeUser === "admin" && producto.owner !== "admin"){

            await modelCourts.deleteOne({_id: id});

            console.log("admin ha eliminado producto de usuario: " + producto.owner);

            await email.deletePremium(req);

            res.status(204).json("producto de usuario de id " + producto.owner + " ha sido eliminado por admin");

        }
        else if(user.typeUser === "premium" && producto.owner === user.id){

            await modelCourts.deleteOne({_id: id});

            res.status(204).json("producto eliminado por su dueño");
        }
        else if(user.typeUser === "premium" && producto.owner !== user.id){

            res.status(400).json("el usuario no puede eliminar un producto que no es suyo")

        }

});

CourtsDB.get("/court/:cid", authToken("jwt"), async (req,res) => {

    let cid = req.params.cid;

    let canchas =  await modelCourts.findById(cid).populate("club_owner");

    console.log(canchas)

    res.status(200).json(canchas);

});


CourtsDB.post("/courtsMedia/:court_title/:typeFile" , TypeUserCheck() ,uploader.single("MyFile"), async(req,res) => {

    // parametros
    let court_title = req.params.court_title;
    let typeFile = req.params.typeFile;


    if(!req.file){

        res.status(400).send({status: "error", error: "no se cargo el documento"});
    }

    
    return res.status(200).send("tu " + typeFile + " " + req.file.originalname + " se ha guardado en el archivo del producto " + court_title);

});

// GET para enviar archivos de fotos de productos (Thumbnail)

CourtsDB.get("/sendFiles/:court/:type/:media", authToken("jwt"), (req,res) => {

    let user = req.user;
    let typeFile = req.params.type;
    let media = req.params.media;
    let court = req.params.court;

    res.status(200).sendFile( _Dirname + "/src/public/clubs/" + user.id + "/courts/" + court + "/" + typeFile + "/" + media );

});




export default CourtsDB