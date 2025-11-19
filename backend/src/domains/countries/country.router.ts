import { Router } from 'express';
import { CountryService } from './country.service';

const service = new CountryService();

export const countryRouter = Router();

countryRouter.get('/', async (req, res) => {
  const countries = await service.getAll();
  return res.json(countries);
});

countryRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const country = await service.getById(id);
  if (!country) return res.status(404).json({ message: 'Country not found' });
  return res.json(country);
});

countryRouter.post('/', async (req, res) => {
  try {
    const dto = req.body;
    const created = await service.create(dto);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create country', error: String(err) });
  }
});

countryRouter.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const dto = req.body;
  const updated = await service.update(id, dto);
  if (!updated) return res.status(404).json({ message: 'Country not found' });
  return res.json(updated);
});

countryRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const deleted = await service.delete(id);
  if (!deleted) return res.status(404).json({ message: 'Country not found' });
  return res.status(204).send();
});
