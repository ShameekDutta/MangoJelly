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
                products: docs.map(doc=>{
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

router.post('/',(req,res,next)=>{
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
            let prod = {};
            console.log("Result is - " + prod);
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
                    product: doc,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/comics'
                    }
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

router.patch('/:comicID',(req,res,next)=>{
    const id = req.params.comicID;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Comic.updateOne({_id: id}, { $set:updateOps}).
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

router.delete('/:comicID',(req,res,next)=>{
    const id = req.params.comicID;
    Comic.remove({_id: id})
        .exec()
        .then(result=>{
            res.status(200).json({
                message: 'Comic deleted',
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/comics',
                    body:{name:'String', price:'Number'}
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
module.exports = router;