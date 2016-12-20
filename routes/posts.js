var express = require('express');
var router = express.Router();

var Post = require('../models/post');
var Comment = require('../models/comment');

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
    } else {
        next();
    }
}

router.get('/', authenticate, function(req, res, next) {
    Post.find({ title: 'Rise and Grind' })
        .then(function(post) {
            var comment = Comment.findOne({});
            res.render('posts/index', {
                posts: post,
                passMeIn: comment
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

//
// router.get('/', authenticate, function(req, res, next) {
//     // Post.find({ user: currentUser }).sort('-createdAt')
//     Post.find({title: 'Rise and Grind'}) // .sort('-createdAt')
//         .then(function(post) {
//             var comment = Comment.find();
//             return [post, comment];
//         })
//         .then(function(postComments) {
//                     res.render('posts/index', {
//                         posts: postComments[0],
//                         comments: postComments[1]
//                     });
//                 })
//         }).catch(function(err) {
//             return next(err);
//         });

// .then(function(posts) {
//     res.render('posts/index', {
//         posts: posts
//     });
// })




// SHOW
    router.get('/new', authenticate, function(req, res, next) {
    var post = {
        user: currentUser,
        title: '',
        content: '',
        website: ''
    };
    res.render('posts/new', {
        post: post
    });
});

router.get('/:id', authenticate, function(req, res, next) {
    Post.findById(req.params.id)
        .then(function(post) {
            if (!post) {
                return next(makeError(res, 'Document not found', 404));
            }
            res.render('posts/show', {
                post: post
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

// CREATE
router.post('/', authenticate, function(req, res, next) {
    var post = new Post({
        user:      req.user,
        title:     req.body.title,
        content: req.body.content,
        website: req.body.website
    });
    post.save()
        .then(function() {
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
            if (!post) {
                return next(makeError(res, 'Document not found', 404));
            }
            if (!post.user.equals(currentUser.id)) {
                return next(makeError(res, 'This does not belong to you!', 401));
            }
            res.render('posts/edit', {
                post: post
            });
        })
        .catch(function(err) {
            return next(err);
        });
});

// UPDATE
router.put('/:id', authenticate, function(req, res, next) {
    Post.findById(req.params.id)
        .then(function(post) {
            if (!post) {
                return next(makeError(res, "I'm having trouble finding that. :(", 404));
            }
            if (!post.user.equals(currentUser.id)) {
                return next(makeError(res, "Please don't modify another coffee lover's post. Comment instead!", 401));
            }
            post.title = req.body.title;
            post.content = req.body.content;
            post.website = req.body.website;
            return post.save();
        })
        .then(function() {
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
            if (!post.user.equals(currentUser.id)) return next(makeError(res, 'This does not belong to you!', 401));
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
            if (!post.user.equals(currentUser.id)) return next(makeError(res, 'This does not belong to you!', 401));
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