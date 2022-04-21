const express=require('express');
const app=express();
const ejs=require('ejs');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const passport=require('passport');
const passportLocalMongoose=require('passport-local-mongoose');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
  secret:"Working on a small project",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin_amith:test123@cluster0.84iyn.mongodb.net/oyester_usersDB");
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(passportLocalMongoose);
const User=mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res)
{
  res.render("login");
});

app.get("/register",function(req,res)
{
  res.render("register");
});

app.get("/user",function(req,res){
  if(req.isAuthenticated()){
    res.render("user");
  }else{
    res.redirect("/login");
  }
});

app.get("/submit",function(req,res){
  if(req.isAuthenticated()){
    res.render("submit");
  }else{
    res.redirect("/login");
  }
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

app.post("/register",function(req,res)
{
User.register({username:req.body.username},req.body.password,function(err,user){
  if(err){
    console.log(err);
    res.redirect("/register");
  }else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/user");
    });
  }
});
});
app.post("/login",function(req,res)
{
  const user=new User({
    username:req.body.username,
    password:req.body.password
  });
  req.login(user,function(err){
    if(err){
      console.log(err);
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/user");
      });
    }
  });
});

app.listen(process.env.PORT || 3000,function(err){
  if(!err){
    console.log("server is up and running");
  }
});
