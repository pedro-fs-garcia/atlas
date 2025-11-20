import { Router } from 'express';
import { CityService } from './city.service';

const service = new CityService();

export const cityRouter = Router();

cityRouter.get('/', async (req, res) => {
  const countryId = req.query.country_id ? Number(req.query.country_id) : undefined;
  const continentId = req.query.continent_id ? Number(req.query.continent_id) : undefined;

  const cities = await service.getAll(countryId, continentId);
  return res.json(cities);
});

cityRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const city = await service.getById(id);
  if (!city) return res.status(404).json({ message: 'City not found' });
  return res.json(city);
});

cityRouter.post('/', async (req, res) => {
  try {
    const dto = req.body;
    const created = await service.create(dto);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create city', error: String(err) });
  }
});

cityRouter.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const dto = req.body;
  const updated = await service.update(id, dto);
  if (!updated) return res.status(404).json({ message: 'City not found' });
  return res.json(updated);
});

cityRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const deleted = await service.delete(id);
  if (!deleted) return res.status(404).json({ message: 'City not found' });
  return res.status(204).send();
});
