

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
const url = 'mongodb://localhost:27017/wikiDB'
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
mongoose.connect(url ,{ useNewUrlParser: true , useUnifiedTopology: true},()=>{
    console.log('Connected');
  } )
mongoose.set('useFindAndModify' , false)

const articleSchema = mongoose.Schema({ title: String, body: String})
const Article = mongoose.model('Article', articleSchema)


app.route('/articles')
.post((req, res)=>{
    const reqBody = req.body
    const newArticle = new Article({title : reqBody.title , body: reqBody.body})
    newArticle.save(err=>{
        if(!err){res.send('Added succesfully.')}
        else{res.send(err)}
    })
})
.get((req ,res)=>{
    Article.find({},(err, foundArticles)=>{
        if(!err){ res.send(foundArticles);}
        else{ res.send(err)}
    })
})
.delete((req, res)=>{
    Article.deleteMany({}, err=>{
        if(!err){ res.send('Deleted all successfully.')}
        else(res.send(err))
    })
 });


 app.route('/articles/:articleTitle')
 .get((req,res)=>{
     const articleTitle = req.params.articleTitle
     Article.findOne({title : articleTitle},(err, foundArticle)=>{
         if(!err){
            if(foundArticle){ res.send(foundArticle)}
            else{res.send('No article found.')}}
         else{ res.send(err)}
     })
 })
 .put((req, res)=>{
    const articleTitle = req.params.articleTitle
    const reqBody = req.body


    Article.update({title: articleTitle},
        {title: reqBody.title, body: reqBody.body},
        {overwrite: true},
        (err)=>{
            if(!err){
                res.send('Updated successfully.')
            }
            else{console.log(err)}
        })
 })
 .patch((req, res)=>{
    const articleTitle = req.params.articleTitle
    const reqBody = req.body


    Article.update({title: articleTitle},
        {$set: reqBody},
        (err)=>{
            if(!err){
                res.send('Updated successfully.')
            }
            else{console.log(err)}
        })
 })
 .delete((req, res)=>{
    const articleTitle = req.params.articleTitle
    Article.deleteOne({title: articleTitle}, err=>{
        if(!err){ res.send('Deleted article successfully.')}
        else(res.send(err))
    })
 });
app.listen(3000, function() {
  console.log("Server started on port 3000");
});