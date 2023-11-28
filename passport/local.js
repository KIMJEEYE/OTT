const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = () => {

  passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    }, async (username, password, done) => {
      try{
        const user = await User.findOne({ where: { username } });

        if(user&&await bcrypt.compare(password,user.password)){
          done(null,user);
      } else {
        done(null,false,{message:'일치하는 아이디가 없습니다.'});
      }
    } catch(error){
      console.error(error);
      done(error);
    }
  }));
};
