const express = require('express');
const userData = require('./userDb');
const postData = require('../posts/postDb')
const router = express.Router();

router.post('/', (req, res) => {
    userData.insert(req.body)
    .then(name => {
        res.status(201).json(name);
    })
    .catch(error => {
    res.status(500).json({ error: "There was an error precessing the requested change" });
  });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    postData.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      res.status(500).json({ error: "There was an error precessing the requested change" });
    });
});

router.get('/', (req, res) => {
    userData.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ error: "There was an error retrieving the requested user" });
    });
});

router.get('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    userData.getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({ error: "There was an error retrieving the requested user" });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
    userData.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ error: "There was an error retrieving the requested post" });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
    const id = req.params.id;
    userData.remove(id)
    .then(deleteById => {
      res.status(200).json({ Message: "The request was successfully precessed" });
    })
    .catch(error => {
      res.status(500).json({ error: "There was an error deleting the requested user" });
    });
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
    const id = req.params.id;
    const updates = req.body;
    userData.update(id, updates)
    .then(updated => {
    if (updated) {
      res
      .status(200)
      .json(updated)
      .end();
    } else {
      res.status(404).json({
      message: "The user with the specified ID does not exist."
      });
    }
    })
    .catch(error => {
    res
      .status(500)
      .json({ error: "The user information could not be modified." });
    });
});

//custom middleware

function validateUserId(req, res, next) {
    userData.getById(req.params.id)
    .then(user => {
      if (user) {
        req.user = req.params.id;
        next();
      } else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: "user not found" });
    });
};

function validateUser(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing" });
    } else if (!req.body.name) {
    res.status(400).json({ message: "missing name" });
    } else {
    next();
    }
};

function validatePost(req, res, next) {
    if (!req.body) {
        res.status(400).json({ message: "missing post data" });
    } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
    } else {
    next();
    }
};

module.exports = router;
