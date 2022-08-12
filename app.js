const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
// we can also make our module we will require that like this 
const date = require(__dirname + "/date.js");




const app = express();
app.use(bodyparser.urlencoded([{ extended: true }]));
app.set('view engine', 'ejs');
// for css folder we make public folder and add that folder here 
app.use(express.static('public'))

mongoose.connect('mongodb+srv://saadd:Saad2113@cluster0.ee2rk.mongodb.net/todoList')
// mongoose.connect('mongodb://localhost:27017/todoList')
const dbschema = new mongoose.Schema({
    name: String
})
const list = mongoose.model("list", dbschema);

const schema = new mongoose.Schema({
    listName: String,
    item: [dbschema]
})
const list2 = mongoose.model("list2", schema);

const welcome = new list({
    name: "Welcome to Saad signs"
})
const add = new list({
    name: "Press + to add items"
})
const defaultitem = [welcome, add];

let today = date.getDate();
app.get("/", function (req, res) {
    list.find({}, function (err, data) {
        if (data.length === 0) {
            list.insertMany(defaultitem)
        }
        if (err) {
            console.log(err)
        }
        else {
            res.render("index", { weekDay: today, listItem: data })
        }
    })
})

app.get("/:title", function (req, res) {
    const titleName = req.params.title;
    list2.findOne({ listName: titleName }, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            if (!data) {
                const List2 = new list2({
                    listName: req.params.title,
                    item: defaultitem
                })
                List2.save();
                res.redirect("/" + titleName);
            }
            else {
                res.render("index", { weekDay: data.listName, listItem: data.item })
                console.log("else")
            }
        }
    })
})

app.post("/", function (req, res) {
    const List = new list({
        name: req.body.input
    })
    if (req.body.btn !== today) {
        list2.findOne({ listName: req.body.btn }, function (err, data) {
            if (err) {
                console.log(err)
            }
            else {
                data.item.push(List);
                data.save();
                res.redirect("/" + req.body.btn);
            }
        })
    }
    else {
        List.save();
        res.redirect("/");
    }
})
app.post("/delete", function (req, res) {
    console.log(req.body.hiddenValue);
    const id = req.body.check;
    if (req.body.hiddenValue === today) {
        list.findByIdAndRemove(id, function (err) {
            if (err) {
                console.log(err)
            }
            else {
                res.redirect("/");
            }
        })
    }
    else{
        list2.findOneAndUpdate({listName: req.body.hiddenValue},{$pull: {item:{_id: id}}}, function(err, data){
            if(!err){
                res.redirect("/"+ req.body.hiddenValue)
            }
        })
    }
})


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);

