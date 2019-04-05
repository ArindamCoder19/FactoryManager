const express = require('express');
const app = express();
/* START: Uncomment for prod */
/*
app.enable('trust proxy');
app.get('*.js', function (req, res, next) {
  req.url = req.url + '.gz';
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', 'text/javascript');
  next();
// });*/

// app.get('*/bundle.css', function(req, res, next) {
//  req.url = req.url + '.gz';
//  res.set('Content-Encoding', 'gzip');
//  res.set('Content-Type', 'text/css');
//  next();
// });

// app.use (function (req, res, next) {
//     if (req.secure) {
//             // request was via https, so do no special handling
//             next();
//     } else {
//             // request was via http, so redirect to https
//             res.redirect('https://' + req.headers.host + req.url);
//     }
// });

/* END: Uncomment for prod */


app.use(express.static('./'));

app.use(express.static('dist'));

app.get('*', (req, res) => {

  console.log(req, res);

  res.sendFile(`${__dirname}/index.html`);

});

const port = process.env.PORT || 3001;



app.listen(port, () => {

  console.log('app listening on', port);

});
