import 'dotenv/config';
import appJson from './app.json';

export default {
  ...appJson,
  expo: {
    ...appJson.expo,
    extra: {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    },
  },
};

