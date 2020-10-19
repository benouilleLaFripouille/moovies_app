const express = require('express');
const app = express();
const expressHandlebars = require("express-handlebars");
const path = require('path');
const port=3000;
const uri = "mongodb+srv://benoit:root@cluster0-cwkwq.gcp.mongodb.net/test?retryWrites=true&w=majority";
app.engine('.haml', require('hamljs').renderFile);

let collectionLike;
let collectionDislike;

const mongoose=require('mongoose');
mongoose.connect(uri,{useNewUrlParser: true, useUnifiedTopology: true });
const db=mongoose.connection;

let MovieLike;
let MovieDislike;

const movieSchemaLike=require('./public/model/movie').movieSchemaLike;
const movieSchemaDislike=require('./public/model/movie').movieSchemaDislike;
db.on('error', console.error.bind(console,'erreur de connexion'));
db.once('open', ()=>{
    MovieLike=mongoose.model('films_preferred', movieSchemaLike);
    MovieDislike=mongoose.model('films_disliked', movieSchemaDislike);
    console.log('connexion reussie');

});


const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true  });

client.connect(() => {
    collectionLike = client.db("Moovies").collection("films_preferred");
    collectionDislike = client.db("Moovies").collection("films_disliked");
});

app.use('/public', express.static(path.join('public')));


app.engine("handlebars", expressHandlebars(

    {
        extname:'.handlebars',
        defaultLayout: 'base',
        layoutsDir:path.join(__dirname,'views/layouts'),
        partialsDir:path.join(__dirname,"views/partial")

    }));

app.set("view engine","handlebars" );

app.get('/', (req, res) => {
    res.render('home')
});

app.get('/mooviesSearch', (req, res) => {
    res.render('mooviesSearch', {layout:"second.handlebars"})

});

app.get('/mooviesSearch/:id', (req, res) => {
    res.render('mooviesDb-details.handlebars', {id:req.params.id})

});

app.get('/like/:id/:title', (req, res)=>
{
    const titre = req.params.title;
    const id = req.params.id;
    collectionLike.findOne({idFilm: id})
        .then((success)=>{
            if (!success) {
                collectionLike.insertOne
                ({
                    idFilm: id,
                    title: titre,
                    like:true
                })
                res.status(200).json({like: true}).end();

            }else if(success){
                collectionLike.updateOne({idFilm: {$eq:id}}, {$set: {like:false}})
                res.status(200).json({like: false}).end();
            }


        });
});

app.get('/dislike/:id/:title', (req, res) =>{
    const titre = req.params.title;
    const id = req.params.id;
    collectionDislike.findOne({idFilm: {$eq:id}})
        .then((success)=>{
            if (!success) {
                collectionDislike.insertOne
                ({
                    idFilm: id,
                    title: titre,
                    dislike:true
                })

                res.status(200).json({dislike: true}).end();

            }else if(success){
                collectionDislike.updateOne({idFilm: {$eq:id}}, {$set: {dislike:true}})
                res.status(200).json({dislike: false}).end();
            }

        });
});



app.listen(port,  () => {
    console.log(`Server is running on port: ${port}`)
});


// Pour se servir de postman il faut faire le code ci-dessous pour tester la consommation des API
// app.get('/postman',(req,res)=> {
//     res.json({
//         message: "salut je viens de moovie app",
//         actif: true,
//         nestedDoc: {
//             title: "title",
//             prix: 122,
//             comment: "trop cher"
//         }
//
//     })
// });
//
// app.post("/postman",(req,res)=>{
//
//     console.log(req.params);
//     res.sendStatus(200)
//
// });

