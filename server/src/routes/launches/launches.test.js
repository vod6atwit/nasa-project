// HTTP assertions made easy via superagent
// request again API
const request = require('supertest');
const app = require('../../app');
const { loadPlanetsData } = require('../../models/planetsModel');
const { mongoConnect, mongoDisconnect } = require('../../services/mongo');

describe('Launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe('Test Get Launches', () => {
    test('It should respond with 200 success', async () => {
      // request automatic called listen on app
      const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
  });

  describe('Test Post Launches', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028',
    };

    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    };
    const launchDataWithoutInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'Invalid Date',
    };

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();

      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test('It should catch missing required launch properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toStrictEqual({
        error: 'Missing required launch properties',
      });
    });

    test('It shouuld catch Invalid launch dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: 'Invalid launch date',
      });
    });
  });
});
