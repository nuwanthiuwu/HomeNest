// /client/src/tests/productSlice.test.js
import productReducer, {
  fetchProducts,
  searchProducts,
  setFilter,
  clearFilters,
  setPage,
} from '../store/productSlice';

const initialState = {
  products: [],
  total: 0,
  page: 1,
  totalPages: 1,
  filters: {
    category: [],
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    rating: 0,
    sort: 'newest',
    search: '',
  },
  loading: false,
  error: null,
};

describe('productSlice reducers', () => {
  it('returns initial state', () => {
    expect(productReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  it('setFilter merges filter updates and resets page to 1', () => {
    const state = {
      ...initialState,
      page: 5,
    };
    const newState = productReducer(state, setFilter({ minPrice: 50, maxPrice: 200 }));
    expect(newState.filters.minPrice).toBe(50);
    expect(newState.filters.maxPrice).toBe(200);
    expect(newState.page).toBe(1);
  });

  it('setFilter with category updates category array', () => {
    const state = { ...initialState };
    const newState = productReducer(state, setFilter({ category: ['cat1', 'cat2'] }));
    expect(newState.filters.category).toEqual(['cat1', 'cat2']);
  });

  it('clearFilters resets all filters to defaults', () => {
    const state = {
      ...initialState,
      filters: {
        category: ['cat1'],
        minPrice: 50,
        maxPrice: 200,
        inStock: true,
        rating: 4,
        sort: 'price_asc',
        search: 'laptop',
      },
      page: 3,
    };
    const newState = productReducer(state, clearFilters());
    expect(newState.filters).toEqual(initialState.filters);
    expect(newState.page).toBe(1);
  });

  it('setPage updates current page', () => {
    const state = { ...initialState };
    const newState = productReducer(state, setPage(3));
    expect(newState.page).toBe(3);
  });
});

describe('fetchProducts thunk', () => {
  it('sets loading on pending', () => {
    const state = productReducer(initialState, fetchProducts.pending());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sets products and pagination on fulfilled', () => {
    const payload = {
      data: {
        products: [{ _id: '1', name: 'Product 1', price: 99.99 }],
        total: 100,
        page: 1,
        totalPages: 10,
      },
    };
    const state = productReducer(initialState, fetchProducts.fulfilled(payload));
    expect(state.loading).toBe(false);
    expect(state.products).toEqual(payload.data.products);
    expect(state.total).toBe(100);
    expect(state.totalPages).toBe(10);
  });

  it('sets error on rejected', () => {
    const state = productReducer(initialState, fetchProducts.rejected(null, '', null, 'Failed to fetch'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });
});

describe('searchProducts thunk', () => {
  it('sets loading on pending', () => {
    const state = productReducer(initialState, searchProducts.pending());
    expect(state.loading).toBe(true);
  });

  it('sets products on fulfilled', () => {
    const payload = {
      data: {
        products: [{ _id: '1', name: 'Laptop', price: 899.99 }],
        total: 5,
        page: 1,
        totalPages: 1,
      },
    };
    const state = productReducer(initialState, searchProducts.fulfilled(payload));
    expect(state.products).toEqual(payload.data.products);
    expect(state.total).toBe(5);
  });

  it('sets error on rejected', () => {
    const state = productReducer(initialState, searchProducts.rejected(null, '', null, 'Search failed'));
    expect(state.error).toBe('Search failed');
  });
});
