import express from 'express'
import webRouter from './router/api';
import cors from 'cors';
const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
webRouter(app);

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

export default app;
