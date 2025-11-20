import express from 'express';
import cors from 'cors';
import { continentRouter } from './domains/continents/continent.router';
import { countryRouter } from './domains/countries/country.router';
import { cityRouter } from './domains/cities/city.router';
import { authRouter } from './domains/users/auth.router';
import { culturalObservationRouter } from './domains/cultural-observations/cultural-observation.router';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/continents', continentRouter);
app.use('/countries', countryRouter);
app.use('/cities', cityRouter);
app.use('/auth', authRouter);
app.use('/cultural-observations', culturalObservationRouter);