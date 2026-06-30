// /server/tests/productController.test.js
const { getProducts, searchProducts } = require('../controllers/productController');

jest.mock('../models/Product');
const Product = require('../models/Product');

const mockReq = (query = {}) => ({ query });
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getProducts', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns paginated products with defaults', async () => {
    const req = mockReq({});
    const res = mockRes();

    Product.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              { _id: '1', name: 'Product 1', price: 99.99 },
            ]),
          }),
        }),
      }),
    });
    Product.countDocuments.mockResolvedValue(50);

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          total: 50,
          page: 1,
          totalPages: 5,
        }),
      })
    );
  });

  it('filters by category', async () => {
    const req = mockReq({ category: 'cat123' });
    const res = mockRes();

    Product.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    Product.countDocuments.mockResolvedValue(0);

    await getProducts(req, res);

    const findCall = Product.find.mock.calls[0][0];
    expect(findCall.category).toBe('cat123');
  });

  it('filters by price range', async () => {
    const req = mockReq({ minPrice: '50', maxPrice: '200' });
    const res = mockRes();

    Product.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    Product.countDocuments.mockResolvedValue(0);

    await getProducts(req, res);

    const findCall = Product.find.mock.calls[0][0];
    expect(findCall.price.$gte).toBe(50);
    expect(findCall.price.$lte).toBe(200);
  });

  it('filters by inStock', async () => {
    const req = mockReq({ inStock: 'true' });
    const res = mockRes();

    Product.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    Product.countDocuments.mockResolvedValue(0);

    await getProducts(req, res);

    const findCall = Product.find.mock.calls[0][0];
    expect(findCall.stock.$gt).toBe(0);
  });

  it('filters by rating', async () => {
    const req = mockReq({ rating: '4' });
    const res = mockRes();

    Product.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      }),
    });
    Product.countDocuments.mockResolvedValue(0);

    await getProducts(req, res);

    const findCall = Product.find.mock.calls[0][0];
    expect(findCall.rating.$gte).toBe(4);
  });

  it('sorts by price ascending', async () => {
    const req = mockReq({ sort: 'price_asc' });
    const res = mockRes();

    const sortMock = jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue([]),
      }),
    });

    Product.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: sortMock,
      }),
    });
    Product.countDocuments.mockResolvedValue(0);

    await getProducts(req, res);

    expect(sortMock).toHaveBeenCalledWith({ price: 1 });
  });

  it('returns 400 on validation error', async () => {
    const req = mockReq({ limit: '999' }); // exceeds max
    const res = mockRes();

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('searchProducts', () => {
  beforeEach(() => jest.clearAllMocks());

  it('performs full-text search', async () => {
    const req = mockReq({ q: 'laptop' });
    const res = mockRes();

    Product.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([
              { _id: '1', name: 'Gaming Laptop', price: 999 },
            ]),
          }),
        }),
      }),
    });
    Product.countDocuments.mockResolvedValue(1);

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ total: 1 }),
      })
    );
  });

  it('returns 400 when search query is missing', async () => {
    const req = mockReq({});
    const res = mockRes();

    await searchProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
