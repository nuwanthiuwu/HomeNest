// /server/tests/authController.test.js
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require('../controllers/authController');

jest.mock('../models/User');
jest.mock('../utils/sendEmail');
jest.mock('jsonwebtoken');

const User = require('../models/User');
const jwt = require('jsonwebtoken');

const mockReq = (body = {}, params = {}, user = null) => ({ body, params, user });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('registerUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('creates a user and returns 201 with token', async () => {
    const req = mockReq({ name: 'Jane', email: 'jane@test.com', password: 'password123' });
    const res = mockRes();

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ _id: 'uid1', name: 'Jane', email: 'jane@test.com', role: 'customer' });
    jwt.sign.mockReturnValue('mocked_token');

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Registration successful' })
    );
  });

  it('returns 400 when email is already in use', async () => {
    const req = mockReq({ name: 'Jane', email: 'jane@test.com', password: 'password123' });
    const res = mockRes();

    User.findOne.mockResolvedValue({ email: 'jane@test.com' });

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already in use' });
  });

  it('returns 400 when required fields are missing', async () => {
    const req = mockReq({ email: 'jane@test.com' });
    const res = mockRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when password is too short', async () => {
    const req = mockReq({ name: 'Jane', email: 'jane@test.com', password: 'short' });
    const res = mockRes();

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 500 on database error', async () => {
    const req = mockReq({ name: 'Jane', email: 'jane@test.com', password: 'password123' });
    const res = mockRes();

    User.findOne.mockResolvedValue(null);
    User.create.mockRejectedValue(new Error('DB error'));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('loginUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 200 and token on valid credentials', async () => {
    const req = mockReq({ email: 'jane@test.com', password: 'password123' });
    const res = mockRes();

    const fakeUser = {
      _id: 'uid1',
      name: 'Jane',
      email: 'jane@test.com',
      role: 'customer',
      isActive: true,
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });
    jwt.sign.mockReturnValue('mocked_token');

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Login successful' })
    );
  });

  it('returns 401 when user does not exist', async () => {
    const req = mockReq({ email: 'ghost@test.com', password: 'password123' });
    const res = mockRes();

    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('returns 401 on wrong password', async () => {
    const req = mockReq({ email: 'jane@test.com', password: 'wrongpass' });
    const res = mockRes();

    const fakeUser = {
      _id: 'uid1',
      isActive: true,
      comparePassword: jest.fn().mockResolvedValue(false),
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('returns 403 when account is deactivated', async () => {
    const req = mockReq({ email: 'jane@test.com', password: 'password123' });
    const res = mockRes();

    const fakeUser = { _id: 'uid1', isActive: false, comparePassword: jest.fn() };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(fakeUser) });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Account has been deactivated' });
  });
});

describe('verifyToken middleware', () => {
  const { verifyToken } = require('../middleware/authMiddleware');

  it('calls next() with valid token', () => {
    const req = { headers: { authorization: 'Bearer valid_token' } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: 'uid1', role: 'customer' });

    verifyToken(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: 'uid1', role: 'customer' });
  });

  it('returns 401 when no token is provided', () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when token is expired or invalid', () => {
    const req = { headers: { authorization: 'Bearer bad_token' } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => { throw new Error('Invalid'); });

    verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
