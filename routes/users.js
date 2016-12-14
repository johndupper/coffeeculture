var express = require('express');
var router = express.Router();

var Post = require('../models/post');

function makeError(res, message, status) {
    res.statusCode = status;
    var error = new Error(message);
    error.status = status;
    return error;
}

function authenticate(req, res, next) {
    if(!req.isAuthenticated()) {
        req.flash('error', 'Please signup or login.');
        res.redirect('/');
    }
    else {
        next();
    }
}

// INDEX
router.get('/', authenticate, function(req, res, next) {
    // get all the todos and render the index view
    Post.find({ user: currentUser }).sort('-createdAt')
        .then(function(posts) {
            res.render('posts/index', { posts: posts } );
        })
        .catch(function(err) {
            return next(err);
        });
});

// NEW
router.get('/new', authenticate, function(req, res, next) {
    var post = {
        title: '',
        completed: false
    };
    res.render('posts/new', { post: post } );
});

// SHOW
router.get('/:id', authenticate, function(req, res, next) {
    Post.findById(req.params.id)
        .then(function(post) {
            if (!post) return next(makeError(res, 'Document not found', 404));
            if (!post.user.equals(currentUser.id)) return next(makeError(res, 'This is not your post!', 401));
            res.render('posts/show', { post: post });
        })
        .catch(function(err) {
            return next(err);
        });
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
    var post = new Post({
        user:      currentUser,
        title:     req.body.title,
        completed: req.body.completed ? true : false
    });
    post.save()
        .then(function(saved) {
            res.redirect('/posts');
        })
        .catch(function(err) {
            return next(err);
        });
});

// EDIT
router.get('/:id/edit', authenticate, function(req, res, next) {
    Post.findById(req.params.id)
        .then(function(post) {
            if (!post) return next(makeError(res, 'Document not found', 404));
            if (!post.user.equals(currentUser.id)) return next(makeError(res, 'This is not your post!', 401));
            res.render('posts/edit', { post: post });
        })
        .catch(function(err) {
            return next(err);
        });
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
    Post.findById(req.params.id)
        .then(function(post) {
            if (!post) return next(makeError(res, 'Document not found', 404));
            if (!post.user.equals(currentUser.id)) return next(makeError(res, 'This is not your post!', 401));
            post.title = req.body.title;
            post.completed = req.body.completed ? true : false;
            return post.save();
        })
        .then(function(saved) {
            res.redirect('/posts');
        })
        .catch(function(err) {
            return next(err);
        });
});

// DESTROY
router.delete('/:id', authenticate, function(req, res, next) {
    Post.findById(req.params.id)
        .then(function(post) {
            if (!post.user.equals(currentUser.id)) return next(makeError(res, 'This is not your post!', 401));
            return post.remove();
        })
        .then(function() {
            res.redirect('/posts');
        })
        .catch(function(err) {
            return next(err);
        });
});

// TOGGLE completed
router.get('/:id/toggle', authenticate, function(req, res, next) {
    Post.findById(req.params.id)
        .then(function(post) {
            if (!post) return next(makeError(res, 'Document not found', 404));
            if (!post.user.equals(currentUser.id)) return next(makeError(res, 'This post is not yours!', 401));
            post.completed = !post.completed;
            return post.save();
        })
        .then(function(saved) {
            res.redirect('/posts');
        })
        .catch(function(err) {
            return next(err);
        });
});

module.exports = router;