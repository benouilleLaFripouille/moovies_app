const monGoose=require('mongoose');
const Schema=monGoose.Schema;

const movieSchemaLike=new Schema({
    idFilm:Number,
    titre: String,
    like: Boolean

});

const movieSchemaDislike=new Schema({
    idFilm:Number,
    titre: String,
    dislike: Boolean

});

module.exports.movieSchemaLike=movieSchemaLike;
module.exports.movieSchemaDislike=movieSchemaDislike;
