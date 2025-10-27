import express from 'express'
import webRouter from './router/api';
import initSeedConfig from './config/seed';
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
webRouter(app);
initSeedConfig();
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
