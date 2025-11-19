import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { CulturalObservationService } from './cultural-observation.service';
import { CreateObservationDTO, UpdateObservationDTO } from './dto/observation.dto';

const service = new CulturalObservationService();

export const culturalObservationRouter = Router();

// Get all observations (with optional filters)
culturalObservationRouter.get('/', async (req, res) => {
  try {
    const filters: any = {};

    if (req.query.country_id) {
      filters.country_id = Number(req.query.country_id);
    }

    if (req.query.user_id) {
      filters.user_id = Number(req.query.user_id);
    }

    const observations = await service.getAll(filters);
    return res.json(observations);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to fetch observations', error: String(err) });
  }
});

// Get observation by id
culturalObservationRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

  const observation = await service.getById(id);
  if (!observation) return res.status(404).json({ message: 'Observation not found' });

  return res.json(observation);
});

// Create observation (protected route)
culturalObservationRouter.post('/', authMiddleware, async (req, res) => {
  try {
    const dto = req.body as CreateObservationDTO;

    if (!dto.country_id || !dto.observation) {
      return res.status(400).json({ message: 'country_id and observation are required' });
    }

    const created = await service.create(dto, req.user!.id);
    return res.status(201).json(created);
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to create observation', error: String(err) });
  }
});

// Update observation (protected route)
culturalObservationRouter.put('/:id', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const dto = req.body as UpdateObservationDTO;
    const updated = await service.update(id, dto, req.user!.id);

    if (!updated) return res.status(404).json({ message: 'Observation not found' });

    return res.json(updated);
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      return res.status(403).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Failed to update observation', error: String(err) });
  }
});

// Delete observation (protected route)
culturalObservationRouter.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const deleted = await service.delete(id, req.user!.id);
    if (!deleted) return res.status(404).json({ message: 'Observation not found' });

    return res.status(204).send();
  } catch (err: any) {
    if (err.message.includes('Unauthorized')) {
      return res.status(403).json({ message: err.message });
    }
    return res.status(500).json({ message: 'Failed to delete observation', error: String(err) });
  }
});
