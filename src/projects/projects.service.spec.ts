import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './projects.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: ProjectsRepository;
  let eventEmitter: EventEmitter2;

  const mockProjectsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByClientId: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: ProjectsRepository,
          useValue: mockProjectsRepository,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repository = module.get<ProjectsRepository>(ProjectsRepository);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a project and emit event', async () => {
      const createProjectDto = {
        country: 'US',
        services_needed: ['web-development'],
        budget: 10000,
        client_id: 1,
      };

      const mockProject = { id: 1, ...createProjectDto };
      mockProjectsRepository.create.mockResolvedValue(mockProject);

      const result = await service.create(createProjectDto);

      expect(repository.create).toHaveBeenCalledWith(createProjectDto);
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'project.created',
        expect.any(Object),
      );
      expect(result).toEqual(mockProject);
    });
  });
});
