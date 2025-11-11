import app from './app.js';
import { ENV } from './config/env.js';

app.listen(ENV.PORT ?? 5000, () => {
  console.log(`server is running on port : ${process.env.PORT ?? 5000}`);
});