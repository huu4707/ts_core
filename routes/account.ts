import { Router } from 'express';
import { AccountService , AccountInput } from '../services/account';
export const accountRouter = Router();
import passport from 'passport';
import { Strategy }  from 'passport-facebook';
import { OAuth2Strategy } from 'passport-google-oauth';
import { FB_APP_ID, FB_CALLBACK_URL,FB_APP_SECRET, GG_CLIENT_ID, GG_CLIENT_SECRET, GG_CALLBACK_URL  } from '../setting';

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
  
passport.use(new Strategy({
      clientID: FB_APP_ID,
      clientSecret:FB_APP_SECRET,
      callbackURL: FB_CALLBACK_URL
},
function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        return done(null, profile);
      });
    }
));
  
  
passport.use(new OAuth2Strategy({
    clientID: GG_CLIENT_ID,
    clientSecret: GG_CLIENT_SECRET,
    callbackURL: GG_CALLBACK_URL,
    },
    function (token, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
})); 


accountRouter.post('/register', (req, res: any) => {
    AccountService.create(req.body)
    .then(customer => {
        delete customer.dataValues.password;
        res.send({ success: true, result: customer })
    })
    .catch(res.onError);
});

accountRouter.post('/login', (req, res: any) => {
    AccountService.login(req.body)
    .then(customer => {
        delete customer.dataValues.password;
        res.send({ success: true, result: customer })
    })
    .catch(res.onError);
});

accountRouter.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));

accountRouter.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
	  function(req, res) {
        res.redirect('/');
});

accountRouter.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

accountRouter.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login'}),
        function(req, res) {
          res.redirect('/');
});

accountRouter.post('/forgot-password', (req, res:any) => {
    let email = req.body.email
    AccountService.forgotPassword(email)
    .then(data => {
        res.send({ success: true, result: 'We sent email reset your password! Please check your email!' })
    })
    .catch(res.onError);
})

accountRouter.put('/forgot/change-password', async function (req, res:any) {
      AccountService.changePassword(req.body)
      .then(customer => {
        res.send({ success: true, result: customer })
    })
    .catch(res.onError);
})