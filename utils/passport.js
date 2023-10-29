const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy; // Make sure to import the GoogleStrategy
const UserModel = require("../models/user");
require("dotenv").config();

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy(
        {
            callbackURL: "/views/google/redirect",
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
        },
        (accessToken, refreshToken, profile, done) => {
            UserModel.findOne({ googleId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    console.log("user is: " + currentUser)
                    done(null, currentUser)
                } else {
                    new UserModel({
                        username: profile.displayName,
                        googleId: profile.id,
                        email : profile.emails[0].value
                    })
                        .save()
                        .then((newUser) => {
                            console.log("new user created: " + newUser);
                            done(null, newUser)
                        });
                }
            })
        }
    )
);

