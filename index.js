const express    = require('express');
const hbs        = require('hbs');
const bodyParser = require('body-parser');
const cookie     = require('cookie-parser');
const async      = require('async');
const session    = require('express-session');
const expressHbs = require('express-handlebars');


//own libs
const config = require('./config');

let app = express();


//use
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookie(config.cookie.secret));
app.use(
    session({
        secret: config.session.secret,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
        }
    })
);
app.use(require('csurf')());

//handlebars
app.engine('hbs', expressHbs({
    layoutsDir   : 'views/layouts',
    defaultLayout: 'main',
    extname      : 'hbs',
}));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getLogin', function(){
    return "Логин";
});

//locals
app.use(function(req, res, next){
    if(req.session.userIndentity != undefined){
        res.locals.user = req.session.userIndentity;
    }
    res.locals._csrfToken = req.csrfToken();
    next();
});

//ПРОВЕРИТЬ
app.use(async function(req, res, next){
    if(req.cookies.authToken != undefined && req.session.userIndentity == undefined){

        let UserModel = require('./models/UserModel');
        let user = await UserModel.findById(req.cookies.authToken.id);
        if(user.series == req.cookies.authToken.series && user.token == req.cookies.authToken.token){

            let token = Math.round((new Date().valueOf() * Math.random())) + '',
                series = Math.round((new Date().valueOf() * Math.random())) + '';

            user.token = token;
            user.series = series;

            console.log(user);

            await UserModel.updateOne({_id: user.id}, user);
            req.session.userIndentity = user;
        }
    }
    next();
});

//settings
app.set('port', process.env.PORT || config.app.port);


//routes require
const indexRouter = require('./routes/indexRouter');


//routes init
app.use('/', indexRouter);


//soft
app.use(function(req, res){
    res.status(404);
    res.render('server/error', {
        layout: null,
        err    : 404,
        messege: "Page not found",
    });
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('server/error', {
        layout : null,
        err    : 500,
        messege: "Iternal Server Error",
    });
});


//listen
app.listen(app.get('port'), function(){
    console.log('Application are working on port: ' + config.app.port + '. Press Crtl+C for closing');
});
