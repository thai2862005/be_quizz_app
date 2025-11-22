import express from 'express'
import webRouter from './router/api';
import initSeedConfig from './config/seed';
import cors from 'cors';
const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
webRouter(app);

// TODO: Run seed separately using one-off command on production
// initSeedConfig().catch(console.error);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
