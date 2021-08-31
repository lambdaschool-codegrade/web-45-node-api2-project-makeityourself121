const express = require('express')
const router = express.Router()
const Posts = require('./posts-model')

router.get('/', (req, res) => {
  Posts.find(req.query)
    .then((post) => {
      res.status(200).json(post)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: 'The posts information could not be retrived',
      })
    })
})

router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({
          message: 'The post with the specified ID does not exist',
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: 'The posts information could not be retrived',
      })
    })
})

router.post('/', (req, res) => {
  const post = req.body
  if (!post.title || !post.contents) {
    res.status(400).json({
      message: 'Please provide title and contents for the post',
    })
  } else {
    Posts.insert(post)
      .then(({ id }) => {
        return Posts.findById(id)
      })
      .then((newPost) => {
        res.status(201).json(newPost)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          message: 'There was an error while saving the post to the database',
        })
      })
  }
})

router.put('/:id', (req, res) => {
  const post = req.body
  if (!post.title || !post.contents) {
    res.status(400).json({
      message: 'Please provide title and contents for the post',
    })
  } else {
    Posts.findById(req.params.id)
      .then((postId) => {
        if (!postId) {
          res.status(404).json({
            message: 'The post with the specified ID does not exist',
          })
        } else {
          return Posts.update(req.params.id, post)
        }
      })
      .then((data) => {
        if (data) {
          return Posts.findById(req.params.id)
        }
      })
      .then((updatedPost) => {
        res.status(200).json(updatedPost)
      })
      .catch((err) => {
        console.log(err)
        res.status(500).json({
          message: 'The post information could not be modified',
        })
      })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id)
    if (!post) {
      res.status(404).json({
        message: 'The post with the specified ID does not exist',
      })
    } else {
      await Posts.remove(req.params.id)
      res.json(post)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'The post information could not be modified',
    })
  }
})

router.get('/:id/comments', async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id)
    if (!post) {
      res.status(404).json({
        message: 'The post with the specified ID does not exist',
      })
    } else {
      const comment = await Posts.findPostComments(req.params.id)
      res.json(comment)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'The comments information could not be retrieved',
    })
  }
})
module.exports = router
