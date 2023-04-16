const { json } = require('body-parser');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comic = require('../models/comics');

router.get('/',(req,res,next)=>{
    Comic.find()
        .select("name author published price discount pages condition _id")
        .exec()
        .then(docs=>{
            console.log(docs);
            const response={
                count: docs.length,
                Comics: docs.map(doc=>{
                    return{
                        name: doc.name,
                        author: doc.author,
                        published: doc.published,
                        price: doc.price,
                        discount: doc.discount,
                        pages: doc.pages,
                        condition: doc.condition,
                        _id: doc._id,
                        request:{
                            type: 'GET',
                            url: 'http://localhost:3000/comics/'+doc._id
                        }
                    }
                })
            };
            res.status(200).json(response);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/add',(req,res,next)=>{
    const comic = new Comic({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        author: req.body.author,
        published: req.body.published,
        price: req.body.price,
        discount: req.body.discount,
        pages: req.body.pages,
        condition: req.body.condition
    });
    comic
        .save()
        .then(result=>{
            console.log("Result is - " + result.name, result.price, result.author, result.discount, result.published, result.pages, result.condition);
            res.status(201).json({
                "message":'Created product successfully',
                "createdProduct": {
                    "name": result.name,
                    "author": result.author,
                    "discount": result.discount,
                    "published": result.published,
                    "pages": result.pages,
                    "condition": result.condition,
                    "price": result.price,
                    "_id": result._id,
                    "request":{
                        "type": 'GET',
                        "url": 'http://localhost:3000/comics/'+result._id
                    }
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:comicID',(req,res,next)=>{
    const id = req.params.comicID;
    Comic.findById(id)
        .select("name author published price discount pages condition _id")
        .exec()
        .then(doc=>{
            console.log("From database", doc);
            if (doc){
                res.status(200).json({
                    comic: doc
                });
            } else {
                res.status(404).json({message: "No valid entry found"});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
    });
});

router.patch('/update/:comicID',(req,res,next)=>{
    const id = req.params.comicID;
    const updateComic={};
    for(const key in req.body){
        updateComic[`${key}`] = `${req.body[key]}`;
    }
    Comic.updateOne({_id: id}, { $set:updateComic}).
        exec()
        .then(result=>{
            console.log(result);
            res.status(200).json({
                message: 'Comic updated',
                request:{
                    type: 'GET',
                    url:'http://localhost:3000/comics/'+id
                }
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/delete/:comicID',(req,res,next)=>{
    const id = req.params.comicID;
    Comic.deleteOne({_id: id})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'Comic deleted'
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router;