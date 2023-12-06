const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = () => {

  passport.use(new LocalStrategy(
    {
      usernameField: 'userId',
      passwordField: 'password',
    }, async (userId, password, done) => {
      try{
        const user = await User.findOne({ where: { userId } });
  
        if(user&&await bcrypt.compare(password,user.password)){
          done(null,user);
      } else {
        done(null,false,{message:'일치하는 아이디나 비밀번호가 없습니다.'});
      }
    } catch(error){
      console.error(error);
      done(error);
    }
  }));
};



