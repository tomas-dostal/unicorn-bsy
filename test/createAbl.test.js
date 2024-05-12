const CreateAbl = require('../abl/list/createAbl');
const userDao = require("../dao/user-dao.js");
const listDao = require("../dao/list-dao.js");

// Mocking request and response objects for testing purposes
const req = {
  body: {
    name: "Test List",
    userId: "12345678901234567890123456789012", // 32 characters
    sharedWith: []
  }
};
const res = {
  status: jest.fn(() => res),
  json: jest.fn()
};

describe('CreateAbl', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  it('should return 400 if dtoIn is not valid', async () => {
    req.body.name = ''; // Making the input invalid
    await CreateAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "dtoInIsNotValid",
      message: "dtoIn is not valid",
      validationError: expect.any(Array),
    });
  });

  it('should return 200 if dtoIn is valid', async () => {
    const mockList = { id: 'someId', name: 'Test List', userId: req.body.userId, sharedWith: [] };
    listDao.create = jest.fn(() => mockList); // Mocking listDao.create to return mockList
    userDao.get = jest.fn(() => ({})); // Mocking userDao.get to return an empty object
    await CreateAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockList);
  });

  it('should return 404 if user does not exist and dtoIn is valid', async () => {
    userDao.get = jest.fn(() => undefined); // Mocking userDao.get to return undefined
    await CreateAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      code: "userNotFound",
      message: `User ${req.body.userId} not found`,
    });
  });

  it('should create a list and return it', async () => {
    const mockList = { id: 'someId', name: 'Test List', userId: req.body.userId, sharedWith: [] };
    listDao.create = jest.fn(() => mockList); // Mocking listDao.create to return mockList
    userDao.get = jest.fn(() => ({})); // Mocking userDao.get to return an empty object
    await CreateAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockList);
  });

  it('should return 500 if an unexpected error occurs', async () => {
    listDao.create = jest.fn(() => { throw new Error('Unexpected error'); }); // Mocking listDao.create to throw an error
    userDao.get = jest.fn(() => ({})); // Mocking userDao.get to return an empty object
    await CreateAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unexpected error' });
  });

  it('should create a list and return it', async () => {
    const mockList = { id: 'someId', name: 'Test List', userId: req.body.userId, sharedWith: [] };
    listDao.create = jest.fn(() => mockList); // Mocking listDao.create to return mockList
    userDao.get = jest.fn(() => ({})); // Mocking userDao.get to return an empty object
    await CreateAbl(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockList);
  });


});

