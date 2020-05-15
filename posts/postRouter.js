const express = require('express');

const router = express.Router();
const pDb = require("./postDb");

router.get('/', (req, res) => {
  pDb.get()
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({ errorMessage: "Trouble acessing the posts"})
  })
});

router.get('/:id', validatePostId, (req, res) => {
 const id = req.params.id;
  pDb.getById(id)
  .then(post => {
    res.status(200).json({post})
  })
  .catch(err => {
    res.status(500).json({errorMessage: "Could not retrieve specified ID"})
  })
});

router.delete('/:id', validatePostById, (req, res) => {
  const id = req.params.id
  pDb.remove(id)
    .then(post => {
      res.status(200).json({post})
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message : "The post could not be removed."})
    })
});

router.put('/:id', validatePostById, validatePost, (req, res) => {
  const id = req.params.id;
  const data = req.body;
    pDb.update(id, data)
      .then( post => {
        res.status(201).json({post})
      })
      .catch(err => {
        console.log(err)
        res.status(500).json({ message: "Post was not updated"})
      })
});

// custom middleware

function validatePost(req, res, next) {
  const data = req.body;
  if(!data){
    res.status(400).json({ message: 'missing post data.'})
} else if(!data.text){
    res.status(400).json({ message: "missing  required text field"})
} else { 
  next();
  }
}

function validatePostById(req, res, next) {
  const id = req.params.id;
  pDb.getById(id)
  .then(post => {
    if(!post) {
      res.status(404).json({error: 'The specified ID does not exist.'})
    } else {
      next();
    }
  })
}

module.exports = router;
