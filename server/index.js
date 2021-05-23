require('dotenv').config()
const express = require('express'),
    massive = require('massive'),
    session = require('express-session'),
    path = require('path'),
    authCtrl = require('./controllers/authController'),
    bikeCtrl = require('./controllers/bikeController'),
    postCtrl = require('./controllers/postController'),
    commentCtrl = require('./controllers/commentController'),
    { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env,
    app = express()

const profile = require('./AWSroutes/api/profile');
app.use('/api/profile', profile);

app.use(express.json())
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 }
}));

massive({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
}).then(db => {
    app.set('db', db)
    console.log('DB online!!!')
    app.listen(SERVER_PORT, () => console.log(`APP listening on port: ${SERVER_PORT}`));
});

//AUTH ENDPOINTS
app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('/auth/user', authCtrl.getUser)

//BIKE ENDPOINTS
app.get('/api/bikes', bikeCtrl.getAllBikes)
app.get('/api/bike/:id', bikeCtrl.getBike)
app.post('/api/bikes', bikeCtrl.addBike)
app.post('/api/bikes/images', bikeCtrl.addBikeImage)
app.get('/api/bike/images/:id', bikeCtrl.getBikeImages)
app.delete('/api/bike/:id', bikeCtrl.deleteBike)
app.get('/api/showcase', bikeCtrl.getShowcaseBikes)
app.put('/api/bike/:id', bikeCtrl.editBike)

//BIKE-PAGINATION ENDPOINTS 
app.post('/api/paginated-bikes', bikeCtrl.getAllBikesPaginated)

//POST ENDPOINTS
app.get('/api/market', postCtrl.getAllPosts)
app.get('/api/post/:id', postCtrl.getPost)
app.post('/api/market', postCtrl.addPost)
app.post('/api/market/images', postCtrl.addPostImage)
app.get('/api/post/images/:id', postCtrl.getPostImages)
app.delete('/api/post/:id', postCtrl.deletePost)
app.put('/api/market/:id', postCtrl.editPost)

//COMMENT ENDPOINTS
app.get('/api/comments/:id', commentCtrl.getPageComments)
app.post('/api/comments', commentCtrl.addComment)
app.get('/api/comment-feed', commentCtrl.getCommentFeed)
app.delete('/api/comment/:id', commentCtrl.deleteComment)
app.put('/api/comment/:id', commentCtrl.markCommentRead)

//HOSTING STUFF
app.use(express.static(__dirname + '/../build'))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'))
})

