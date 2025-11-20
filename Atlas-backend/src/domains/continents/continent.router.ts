import { Router } from 'express';
import { ContinentService } from './continent.service';
import { CreateContinentDTO } from './dto/create-continent.dto';

const service = new ContinentService();

export const continentRouter = Router();

continentRouter.get('/', async (req, res) => {
    const continents = await service.getAll();
    return res.json(continents);
});

continentRouter.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const continent = await service.getById(id);
    if (!continent) return res.status(404).json({ message: 'Continent not found' });
    return res.json(continent);
});

continentRouter.post('/', async (req, res) => {
    try {
        const dto = req.body as CreateContinentDTO;
        const created = await service.create(dto);
        return res.status(201).json(created);
    } catch (err: any) {
        return res.status(500).json({ message: 'Failed to create continent', error: String(err) });
    }
});

continentRouter.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const dto = req.body as Partial<CreateContinentDTO>;
    const updated = await service.update(id, dto);
    if (!updated) return res.status(404).json({ message: 'Continent not found' });
    return res.json(updated);
});

continentRouter.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ message: 'Invalid id' });

    const deleted = await service.delete(id);
    if (!deleted) return res.status(404).json({ message: 'Continent not found' });
    return res.status(204).send();
});