var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt   = require('bcrypt-nodejs');
var Post = require('./models/post');
var User = require('./models/user');

// Connect to database
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
}
else {
    mongoose.connect('mongodb://localhost/coffeeculture');
}
mongoose.connection.on('error', function(err) {
        console.error('MongoDB connection error: ' + err);
        process.exit(-1);
    }
);
mongoose.connection.once('open', function() {
    console.log("Mongoose has connected to MongoDB!");
});

function quit() {
    mongoose.disconnect();
    console.log('\nQuitting!');
}

function handleError(err) {
    console.error('ERROR:', err);
    quit();
    return err;
}

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


Post.remove({})
    .then(function() {
        return User.remove({});
    })
    .then(function() {
        return User.create(getUsers());
    })
    .then(function(users) {
        console.log('Saved users:', users);
        var riseAndGrind = new Post({
            user: users[0],
            title: 'Rise and Grind',
            content: 'This is the coolest coffee shop in Hollywood.',
            website: 'http://risengrindla.com/'
        });
        var starbucks   = new Post({
            user: users[0],
            title: 'Starbucks @ PCM',
            content: 'You know, Starbucks.',
            website: 'http://starbucks.com/'
        });
        var spillerPark  = new Post({
            user: users[1],
            title: 'Spiller Park @ PCM',
            content: 'This place is pretty cool. They drink their own coffee!',
            website: 'http://www.spillerpark.com/'
        });
        var dancingGoats   = new Post({
            user: users[1],
            title: 'Dancing Goats @ PCM',
            content: 'This place is known for having great single-origin pour overs!',
            website: 'https://www.batdorfcoffee.com/retail-locations.html'
        });
        return Post.create([riseAndGrind, starbucks, spillerPark, dancingGoats]);
    })
    .then(function(savedPosts) {
        console.log('Just saved', savedPosts.length, 'posts.');
        return Post.find({});
    })
    .then(function(allPosts) {
        console.log('Printing all posts:');
        allPosts.forEach(function(post) {
            console.log(post.title);
        });
        return Post.findOne({title: 'Dancing Goats @ PCM'});
    })
    .then(function(dancingGoat) {
        console.log('Dancing Goat URL: ', dancingGoat.website);
    })
    .then(function() {
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