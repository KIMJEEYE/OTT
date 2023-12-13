const passport = require('passport');
const Strategy = require('passport-kakao').Strategy;

const User = require('../models/User');

module.exports = () => {
    passport.use(new Strategy({
        clientID: process.env.KAKAO_ID,    
        callbackURL: '/auth/kakao/callback',

    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({
                where: { userId: profile.id }
            });
            if (!user)
                user = await User.create({
                    userId: profile.id,   
                    password: '',
                    username: profile.username,
                    dateOfBirth: null,
                    phoneNumber: null
                });

            done(null, user);
        } catch (error) {
            console.error(error);
            done(error);
        }
    }));
};
