// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from '../src/app.module';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Project } from '../src/projects/entities/project.entity';

// describe('ProjectsController (e2e)', () => {
//   let app: INestApplication;
//   let projectRepository;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();

//     app = moduleFixture.createNestApplication();
//     projectRepository = moduleFixture.get(getRepositoryToken(Project));
//     await app.init();
//   });

//   it('/projects (POST)', () => {
//     return request(app.getHttpServer())
//       .post('/projects')
//       .send({
//         country: 'US',
//         services_needed: ['web-development'],
//         budget: 10000,
//       })
//       .expect(201)
//       .expect((res) => {
//         expect(res.body.country).toBe('US');
//         expect(res.body.services_needed).toEqual(['web-development']);
//       });
//   });

//   afterAll(async () => {
//     await app.close();
//   });
// });
