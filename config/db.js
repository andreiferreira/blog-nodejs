if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI: "mongodb+srv://andrei:andrei@blognodejs.amr8j.mongodb.net/blonodejs?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI: "mongodb://localhost/blonodejs"}
}