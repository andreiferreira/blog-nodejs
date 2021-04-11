if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://andrei:<w97.5e$.f4btykz>@cluster0.th5v3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blonodejs"}
}