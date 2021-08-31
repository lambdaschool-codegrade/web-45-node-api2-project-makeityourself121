// implement your posts router here
const express = require('express')
const router = express.Router()
const Posts = require('./posts-model')

router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(post => {
        res.status(200).json(post)
    })
    .catch(err => {
        res.status(500).json({
            message: 'The posts information could not be retrived'
        })
    })
})