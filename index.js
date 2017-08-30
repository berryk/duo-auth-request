const express = require('express');
const Duo = require('duo_web');
var bodyParser = require('body-parser');

var jwt = require('jwt-express');
var cookieParser = require('cookie-parser');

const port = 3000; 

var akey = 'Xkex;3(h%H9.EwI[0tE0=Q$Xa}8mUjCy;4$v[ty;';
var ikey = 'DIAFN376MVBC99W16C2I'; 
var skey = 'NUXjuns2t18ilBJTKYGmM8XvignqutLevZED8vfo';
var user = 'keithwberry@gmail.com';

const app = express();
app.use(cookieParser());
app.set('views', './views');
app.set('view engine','pug');

app.use(jwt.init('NUXjuns2t18ilBJTKYGmM8XvignqutLevZED8vfo'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/',function(req, resp){
  console.log(req.url);
  resp.sendStatus(403); 
});

app.get('/login', jwt.active(), function(req, resp){

    resp.sendStatus(200);
});

app.post('/response',function(req, resp){

  //console.log(req.body);
  var sig_response = req.body.sig_response;
  var auth_user=Duo.verify_response(ikey, skey, akey, sig_response);

  //console.log("User:",auth_user);
  
  if( user == auth_user ){
    var jwt = resp.jwt({
      user: auth_user 
    });
    //console.log(jwt);
    resp.sendStatus(200);
  } else {
    resp.sendStatus(403);
  }
});

app.listen(port, function(){
  console.log("Server is listening on port:",port);
});

app.use(function(err, req, resp, next) {
  if (err.name == 'JWTExpressError') {
      // user is unauthorized
      var sig_req = Duo.sign_request(ikey,skey,akey,user); 
      resp.render('login', { host: "api-1b4b0886.duosecurity.com", sig_request: sig_req, post_action: "response"});
  } else {
      next(err);
  }
});
