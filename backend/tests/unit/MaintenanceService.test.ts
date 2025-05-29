import { MaintenanceService } from '../../src/services/MaintenanceService';
import { DatabaseContext } from '../../src/config/database-context';
import { Maintenance } from '../../src/models/Maintenance';
import { Repository, QueryFailedError } from 'typeorm';
import { NotFoundError } from '../../src/errors/NotFoundError';
import { InvalidDataError } from '../../src/errors/InvalidDataError';
import { beforeEach, describe, it, expect, jest } from '@jest/globals';

jest.mock('../../src/config/database-context');

describe('MaintenanceService', () => {
  let service: MaintenanceService;
  let repo: jest.Mocked<Repository<Maintenance>>;

    beforeEach(() => {
        repo = {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as any;

        // 2) Make DatabaseContext.getInstance() return our mocked repo
        (DatabaseContext.getInstance as jest.Mock).mockReturnValue({
            getRepository: () => repo,
        });

        // 3) Re-instantiate the service under test
        service = new MaintenanceService();

        // 4) Stub out all related lookups with simple async functions
        (service as any).partService = {
            findById: async (_id: string) => ({ installationDate: new Date() } as any),
        };
        (service as any).equipmentService = {
            findById: async (_id: string) => ({ initialOperationsDate: new Date() } as any),
        };
        (service as any).areaService = {
            findById: async (_id: string) => ({} as any),
        };
        (service as any).plantService = {
            findById: async (_id: string) => ({} as any),
        };
    });

    describe('findById', () => {
        it('throws NotFoundError if missing', async () => {
        repo.findOne.mockResolvedValue(null);
        await expect(service.findById('x')).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('throws if no date provided', async () => {
      await expect(service.create({
        title: 'T',
        partId: 'p', equipmentId: 'e', areaId: 'a', plantId: 'pl'
      })).rejects.toThrow(InvalidDataError);
    });

    it('propagates DB errors', async () => {
      repo.create.mockReturnValue({} as any);
      repo.save.mockRejectedValue(new QueryFailedError('', [], new Error('fk')));
      await expect(service.create({
        title: 'T',
        dueDate: new Date().toISOString(),
        partId: 'p', equipmentId: 'e', areaId: 'a', plantId: 'pl'
      })).rejects.toThrow(QueryFailedError);
    });
  });

  describe('update', () => {
    it('throws NotFoundError if missing', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.update('x', {})).rejects.toThrow(NotFoundError);
    });

    it('throws on invalid dueDate', async () => {
      const existing = { id: '1', dueDate: new Date(), partId: 'p', equipmentId: 'e', areaId: 'a', plantId: 'pl' } as any;
      repo.findOneBy.mockResolvedValue(existing);
      await expect(service.update('1', { dueDate: new Date('2000-01-01').toISOString() }))
        .rejects.toThrow(InvalidDataError);
    });
  });

  describe('delete', () => {
    it('removes when found', async () => {
      const m = { id: '1' } as any;
      repo.findOneBy.mockResolvedValue(m);
      await service.delete('1');
      expect(repo.remove).toHaveBeenCalledWith(m);
    });

    it('throws NotFoundError if missing', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.delete('1')).rejects.toThrow(NotFoundError);
    });
  });
});
