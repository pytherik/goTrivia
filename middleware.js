const redirectLogin = (req, res, next) => {
  if (!req.session.user) {
    res.redirect('/login');
  } else {
    next();
  }
}

const redirectHome = (req, res, next) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

module.exports = {
  redirectHome,
  redirectLogin
}