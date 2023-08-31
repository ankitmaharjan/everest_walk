const request = require('supertest');
const app = require('../server'); // Path to your app.js file
const expect = require('chai').expect;
const server = request(app);

describe('API Endpoints', () => {
  let createdRecordId;
  it('should create a new record', async () => {
    const newRecord = { Name: 'Adam', Email: 'adam@gmail.com', Phone_Number: '9856337845' };
    const response = await server.post('/api/create_record').send(newRecord);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    createdRecordId = response.body.id; // Assuming UUID is returned in response
    expect(response.body.Name).toBe(newRecord.Name);
    expect(response.body.Email).toBe(newRecord.Email);
    expect(response.body.Phone_Number).toBe(newRecord.Phone_Number);
  });

  it('should retrieve a list of all records', async () => {
    const response = await server.get('/api/get_all_records');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should retrieve a single record by uuid', async () => {
    const response = await server.get(`/api/get_Single_record/${createdRecordId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('Name');
    expect(response.body).toHaveProperty('Email');
    expect(response.body).toHaveProperty('Phone_Number');
  });

  it('should update an existing record', async () => {
    const updatedRecord = { Name: 'Kishan', Email: 'kisan@gmail.com', phone: '9876543210' };
    const response = await server.put(`/api/update_record/${createdRecordId}`).send(updatedRecord);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(createdRecordId);
    expect(response.body.Name).toBe(updatedRecord.Name);
    expect(response.body.Email).toBe(updatedRecord.Email);
    expect(response.body.Phone_Number).toBe(updatedRecord.Phone_Number);
  });

  it('should delete a record by ID', async () => {
    const response = await server.delete(`/api/delete_record/${createdRecordId}`);

    expect(response.status).toBe(204);

    // Verify that the record is deleted by trying to retrieve it again
    const getResponse = await server.get(`/api/get_Single_record/${createdRecordId}`);
    expect(getResponse.status).toBe(404);
  });

 
});
