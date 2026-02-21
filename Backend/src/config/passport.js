import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import { User } from "../model/user.model.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleID: profile.id }); //find the user in our database if exist then return user
                if (user) {
                    return done(null, user);
                }

                // if not found, check if email already exists

                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    user.googleID = profile.id;
                    user.provider = "google";
                    await user.save();
                    return done(null, user);
                }

                // if not, create a new user

                user = await User.create({
                    fullname: profile.displayName,
                    email: profile.emails[0].value,
                    googleID: profile.id,
                    provider: "google",
                });

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        },
    ),
);

passport.use(
    new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubID: profile.id });
            if (user) {
                return done(null, user);
            }

            user = await User.findOne({ email: profile.emails?.[0].value });

            console.log("email:", profile.emails?.[0].value);
            
            if (user) {
                user.githubID = profile.id;
                user.provider = "github";
                await user.save();
                return done(null, user);
            }

            user = await User.create({
                fullname: profile.displayName || profile.username,
                email: profile.emails[0].value,
                githubID: profile.id,
                provider: "github",
            });

            return done(null, user);
        } catch (error) {
            return done(error, null);
        }
    }),
);

export default passport;
