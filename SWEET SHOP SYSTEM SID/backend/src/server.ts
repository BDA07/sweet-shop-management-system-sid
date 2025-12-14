import * as dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import { createApp } from './app';

const PORT = process.env.PORT || 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});