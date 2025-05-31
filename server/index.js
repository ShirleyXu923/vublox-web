const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('dotenv').config();
const axios = require('axios');
const http = require('http');

const PORT = config.parsed.PORT || 3001;

const app = express();
const server = http.createServer(app);

app.get('/', (req, res, next) => {
  const indexPath = path.resolve(__dirname, '..', 'postbuild', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }

    htmlData = htmlData.replace(
      "<title>Vublox</title>",
      `<title>Home</title>`
    )
      .replace('__META_DESCRIPTION__', 'Home Revolutionising How You Experience Events In History, Present, and Futures')
      .replace('__META_OG_TITLE__', 'Vublox')
      .replace('__META_OG_DESCRIPTION__', 'Home Revolutionising How You Experience Events In History, Present, and Futures')
      .replace('__META_OG_IMAGE__', 'https://vublox.s3.ap-northeast-2.amazonaws.com/banner/article_banner.png')
    return res.send(htmlData);
  });
});

/**
 * Post Page
 */
app.get('/posts/:id', (req, res, next) => {
  const indexPath = path.resolve(__dirname, '..', 'postbuild', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }
    // get id
    const { id } = req.params;
    axios.get(`${config.parsed.REACT_APP_API_URL}/posts/${id}`)
      .then(resp => {
        const item = resp.data;

        // inject meta tags
        htmlData = htmlData.replace(
          "<title>Vublox</title>",
          `<title>${item.title}</title>`
        )
          .replace('__META_DESCRIPTION__', item.description || '')
          .replace('__META_OG_TITLE__', item.title)
          .replace('__META_OG_DESCRIPTION__', item.description || '')
          .replace('__META_OG_IMAGE__', item.preview_image_urls?.md || 'https://vublox.s3.ap-northeast-2.amazonaws.com/banner/article_banner.png')
        return res.send(htmlData);
      }).catch((error) => {
        return res.send(htmlData);
      });
  });
});

/**
 * Events page
 */
app.get('/events/:id', (req, res, next) => {
  const indexPath = path.resolve(__dirname, '..', 'postbuild', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }
    // get id
    const { id } = req.params;
    axios.get(`${config.parsed.REACT_APP_API_URL}/events/${id}`)
      .then(resp => {
        const item = resp.data;

        // inject meta tags
        htmlData = htmlData.replace(
          "<title>Vublox</title>",
          `<title>${item.name}</title>`
        )
          .replace('__META_DESCRIPTION__', item.description || '')
          .replace('__META_OG_TITLE__', item.name)
          .replace('__META_OG_DESCRIPTION__', item.description || '')
          .replace('__META_OG_IMAGE__', item.banner_url?.md)
        return res.send(htmlData);
      }).catch((error) => {
        return res.send(htmlData);
      });
  });
});

/**
 * Timelines Page
 */
app.get('/timelines/:id', (req, res, next) => {
  const indexPath = path.resolve(__dirname, '..', 'postbuild', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }
    // get id
    const { id } = req.params;
    axios.get(`${config.parsed.REACT_APP_API_URL}/timelines/${id}`)
      .then(resp => {
        const item = resp.data.timeline;

        // inject meta tags
        htmlData = htmlData.replace(
          "<title>Vublox</title>",
          `<title>${item.name}</title>`
        )
          .replace('__META_DESCRIPTION__', item.description || '')
          .replace('__META_OG_TITLE__', item.name)
          .replace('__META_OG_DESCRIPTION__', item.description || '')
          .replace('__META_OG_IMAGE__', item.cover_image?.md || '')
        return res.send(htmlData);
      }).catch((error) => {
        return res.send(htmlData);
      });
  });
});

/**
 * Organizations Page
 */
app.get('/organizations/:id', (req, res, next) => {
  const indexPath = path.resolve(__dirname, '..', 'postbuild', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }
    // get id
    const { id } = req.params;
    axios.get(`${config.parsed.REACT_APP_API_URL}/organizations/${id}`)
      .then(resp => {
        const item = resp.data;

        // inject meta tags
        htmlData = htmlData.replace(
          "<title>Vublox</title>",
          `<title>${item.name}</title>`
        )
          .replace('__META_DESCRIPTION__', item.bio || '')
          .replace('__META_OG_TITLE__', item.name)
          .replace('__META_OG_DESCRIPTION__', item.bio || '')
          .replace('__META_OG_IMAGE__', item.logo?.md || '')
        return res.send(htmlData);
      }).catch((error) => {
        return res.send(htmlData);
      });
  });
});

/**
 * Profile Page
 */
app.get('/profile/:id', (req, res, next) => {
  const indexPath = path.resolve(__dirname, '..', 'postbuild', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }
    // get id
    const { id } = req.params;

    if (id === 'script-en.js') {
      return res.send(htmlData);
    }

    axios.get(`${config.parsed.REACT_APP_API_URL}/users/profile?user_id=${id}`)
      .then(resp => {
        const item = resp.data;
        // inject meta tags
        htmlData = htmlData.replace(
          "<title>Vublox</title>",
          `<title>${item.display_name || 'Vublox'}</title>`
        )
          .replace('__META_DESCRIPTION__', item?.profile?.bio)
          .replace('__META_OG_TITLE__', item.display_name || 'Vublox')
          .replace('__META_OG_DESCRIPTION__', item?.profile?.bio || 'Revolutionising How You Experience Events In History, Present, and Futures')
          .replace('__META_OG_IMAGE__', item.image?.md || 'https://vublox.s3.ap-northeast-2.amazonaws.com/banner/article_banner.png')
        return res.send(htmlData);
      }).catch((error) => {
        htmlData
          .replace('__META_DESCRIPTION__', 'Revolutionising How You Experience Events In History, Present, and Futures')
          .replace('__META_OG_TITLE__', 'Vublox')
          .replace('__META_OG_DESCRIPTION__', 'Revolutionising How You Experience Events In History, Present, and Futures')
          .replace('__META_OG_IMAGE__', 'https://vublox.s3.ap-northeast-2.amazonaws.com/banner/article_banner.png');
        return res.send(htmlData);
      });
  });
});

/**
 * Locations Page
 */
app.get('/locations/:slug', (req, res, next) => {
  const indexPath = path.resolve(__dirname, '..', 'postbuild', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return res.status(404).end()
    }
    // get slug
    const { slug } = req.params;
    axios.get(`${config.parsed.REACT_APP_API_URL}/locations/${slug}`)
      .then(resp => {
        const item = resp.data;

        // inject meta tags
        htmlData = htmlData.replace(
          "<title>Vublox</title>",
          `<title>${item.name}</title>`
        )
          .replace('__META_DESCRIPTION__', item.address || '')
          .replace('__META_OG_TITLE__', item.name)
          .replace('__META_OG_DESCRIPTION__', item.address || '')
          .replace('__META_OG_IMAGE__', 'https://vublox.s3.ap-northeast-2.amazonaws.com/banner/article_banner.png')
        return res.send(htmlData);
      }).catch((error) => {
        return res.send(htmlData);
      });
  });
});

// static resources should just be served as they are
app.use(express.static(
  path.resolve(__dirname, '..', 'postbuild'),
  { maxAge: '30d' },
));

app.get('*', function (request, response) {
  const indexPath = path.resolve(__dirname, '..', 'postbuild', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err);
      return response.status(404).end()
    }

    htmlData = htmlData
      .replace('__META_OG_TITLE__', 'Vublox')
      .replace('__META_DESCRIPTION__', 'Revolutionising How You Experience Events In History, Present, and Futures')
      .replace('__META_OG_DESCRIPTION__', 'Revolutionising How You Experience Events In History, Present, and Futures')
      .replace('__META_OG_IMAGE__', 'https://vublox.s3.ap-northeast-2.amazonaws.com/banner/article_banner.png')
    return response.send(htmlData);
  });
});

// listening...
app.listen(PORT, (error) => {
  if (error) {
    return console.error('Error during app startup', error);
  }
  console.log("listening on " + PORT + "...");

  if (process.send) {
    // send signal to trigger the --wait-ready option on pm2
    process.send('ready');
  }
});

process.on('SIGINT', function () {
  server.close(function () {
    // sending a SIGKILL
    process.exit(0);
  });
});
