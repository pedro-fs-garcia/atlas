import express from 'express';
import { continentRouter } from './domains/continents/continent.router';
import { countryRouter } from './domains/countries/country.router';
import { authRouter } from './domains/users/auth.router';
import { culturalObservationRouter } from './domains/cultural-observations/cultural-observation.router';

export const app = express();

app.use(express.json());

app.use('/continents', continentRouter);
app.use('/countries', countryRouter);
app.use('/auth', authRouter);
app.use('/cultural-observations', culturalObservationRouter);