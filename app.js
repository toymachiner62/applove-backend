const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({credentials: true, origin: true}));

app.listen(3000, () => console.log('Listening on port 3000'));

// TODO - Should probably deal with state from github oauth docs.
// Endpoint for github oauth callback. Redirect back to UI with code as query param
app.get('/api/v1/auth/callback', (req, res) => {
  //res.redirect('https://applove.now.sh/#/?code=' + req.query.code);

  // Take authorization code we got from github and get an authorization token
  axios({
    method: 'POST',
    headers: {'Accept': 'application/json'},
    data: {
      client_id: 'ad8537ed99290f08e25b',
      client_secret: 'fc7d82ae06706f352b83ec2aedb6e2cbf5edfef2',
      code: req.query.code,
      // redirect_uri: 'https://applove.now.sh',
      // state: ''
    },
    url: 'https://github.com/login/oauth/access_token'
  })
  .then(response => {
    if(response.status === 200) {
      console.log(response.data);
      // return res.redirect(`https://applove.now.sh/#/?access_token=${response.data.access_token}`);
      return res.redirect(`http://localhost:8080/#/?access_token=${response.data.access_token}`);
    }

    return res.status(500).send('Oops! There was an error authorizing you');
  })
  .catch(err => {
    console.log(err);
    return res.status(500).send('Oops! There was an error authorizing you');
  })


})

// 500 handler
app.use(function (err, req, res, next) {
  console.error(err.stack)
  return res.status(500).send('Something broke!')
})

// 404 handler
app.use((req, res, next) => {
  return res.status(404).send('Oops! Not a valid endpoint');
})
