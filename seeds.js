var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt   = require('bcrypt-nodejs');
var Post = require('./models/post');
var User = require('./models/user');

mongoose.connect('mongodb://localhost/coffeeculture');

// our script will not exit until we have disconnected from the db.
function quit() {
    mongoose.disconnect();
    console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
    console.error('ERROR:', err);
    quit();
    return err;
}


// create some User objects
function getUsers() {
    var john = new User({
        local: {
            email: 'jd@me.co',
            password: bcrypt.hashSync('test',  bcrypt.genSaltSync(8))
        }
    });
    var kim = new User({
        local: {
            email: 'kw@me.co',
            password: bcrypt.hashSync('test2', bcrypt.genSaltSync(8))
        }
    });
    return [john, kim];
}

console.log('removing old posts...');
Post.remove({})
    .then(function() {
        console.log('removing old users...');
        return User.remove({});
    })
    .then(function() {
        return User.create(getUsers());
    })
    .then(function(users) {
        console.log('Saved users:', users);
        console.log('creating some new posts...');

        var starbucks   = new Post({ user: users[0], title: 'Starbucks @ PCM',  completed: false });
        var spillerPark  = new Post({ user: users[0], title: 'Spiller Park @ PCM', completed: true  });

        var dancingGoats   = new Post({ user: users[1], title: 'Dancing Goats @ PCM',  completed: false });
        var westElm = new Post({ user: users[1], title: 'West Elm Coffee Shop', completed: true  });

        return Post.create([starbucks, spillerPark, dancingGoats, westElm]);
    })
    .then(function(savedPosts) {
        console.log('Just saved', savedPosts.length, 'posts.');
        return Post.find({});
    })
    .then(function(allPosts) {
        console.log('Printing all posts:');
        allPosts.forEach(function(post) {
            console.log(post);
        });
        return Post.findOne({title: 'Dancing Goats @ PCM'});
    })
    .then(function(dancingGoats) {
        dancingGoats.completed = true;
        return dancingGoats.save();
    })
    // .then(function(cleanBatcave) {
    //   console.log('updated cleanBatcave:', cleanBatcave);
    //   return cleanBatcave.remove();
    // })
    .then(function(deleted) {
        return Post.find({});
    })
    .then(function(allPosts) {
        console.log('Printing all posts:');
        allPosts.forEach(function(post) {
            console.log(post);
        });
        quit();
    })
    .catch(handleError);