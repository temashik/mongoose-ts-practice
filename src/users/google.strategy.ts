/*import passport from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import UsersModel from './users.model';
import { injectable } from 'inversify';

@injectable()
export class GoogleStrategy {
	constructor(){
		new Strategy(
			{
				clientID: GOOGLE_CLIENT_ID,
				clientSecret: GOOGLE_CLIENT_SECRET,
				callbackURL: 'http://localhost:8000/gcallback',
				passReqToCallback: true,
			})
	}
}

const GOOGLE_CLIENT_ID = '127659636571-hg34uvk9m0t301f3s4ca21fcnqpv0aek.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
	new Strategy(
		{
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:8000/gcallback',
			passReqToCallback: true,
		},
		(req: Request, profile: any, done: any) => {
			const existedUser = UsersModel.findOne({ profile.name });
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return done(err, user);
			});
		},
	),
);*/
