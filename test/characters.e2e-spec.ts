import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import {
  mockCreateCharacterDto,
  mockUpdateCharacterDto,
} from './utils/mock-data';

describe('CharactersController (e2e)', () => {
  let app: INestApplication;
  let createdCharacterId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /characters', () => {
    it('should create a new character', async () => {
      const response = await request(app.getHttpServer())
        .post('/characters')
        .send(mockCreateCharacterDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        ...mockCreateCharacterDto,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      createdCharacterId = response.body.id;
    });

    it('should validate character data', async () => {
      const invalidData = {
        name: '',
        episodes: ['INVALID_EPISODE'],
      };

      const response = await request(app.getHttpServer())
        .post('/characters')
        .send(invalidData)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringMatching(
            /each value in episodes must be one of the following values/,
          ),
        ]),
      );
    });
  });

  describe('GET /characters', () => {
    it('should return paginated characters', async () => {
      const response = await request(app.getHttpServer())
        .get('/characters')
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body).toEqual({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            episodes: expect.arrayContaining([
              expect.stringMatching(/^(NEWHOPE|EMPIRE|JEDI)$/),
            ]),
          }),
        ]),
        total: expect.any(Number),
        page: 1,
        take: 10,
      });
    });
  });

  describe('GET /characters/:id', () => {
    it('should return a character by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/characters/${createdCharacterId}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdCharacterId,
        ...mockCreateCharacterDto,
      });
    });

    it('should return 404 for non-existent character', async () => {
      await request(app.getHttpServer()).get('/characters/999999').expect(404);
    });
  });

  describe('PATCH /characters/:id', () => {
    it('should update a character', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/characters/${createdCharacterId}`)
        .send(mockUpdateCharacterDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdCharacterId,
        ...mockUpdateCharacterDto,
      });
    });

    it('should return 404 for non-existent character', async () => {
      await request(app.getHttpServer())
        .patch('/characters/999999')
        .send(mockUpdateCharacterDto)
        .expect(404);
    });
  });

  describe('DELETE /characters/:id', () => {
    it('should delete a character', async () => {
      await request(app.getHttpServer())
        .delete(`/characters/${createdCharacterId}`)
        .expect(202);

      // Verify the character was deleted
      await request(app.getHttpServer())
        .get(`/characters/${createdCharacterId}`)
        .expect(404);
    });

    it('should return 404 for non-existent character', async () => {
      await request(app.getHttpServer())
        .delete('/characters/999999')
        .expect(404);
    });
  });
});
