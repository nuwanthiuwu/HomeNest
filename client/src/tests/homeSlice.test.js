// /client/src/tests/homeSlice.test.js
import homeReducer, {
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchCategories,
  fetchActivePromotions,
} from '../store/homeSlice';

const initialState = {
  featuredProducts: [],
  newArrivals: [],
  categories: [],
  promotions: [],
  loading: false,
  error: null,
};

describe('homeSlice reducers', () => {
  it('returns initial state', () => {
    expect(homeReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });
});

describe('fetchFeaturedProducts thunk', () => {
  it('sets loading on pending', () => {
    const state = homeReducer(initialState, fetchFeaturedProducts.pending());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sets featured products on fulfilled', () => {
    const payload = { data: [{ _id: '1', name: 'Product 1', price: 99.99 }] };
    const state = homeReducer(initialState, fetchFeaturedProducts.fulfilled(payload));
    expect(state.loading).toBe(false);
    expect(state.featuredProducts).toEqual(payload.data);
  });

  it('sets error on rejected', () => {
    const state = homeReducer(initialState, fetchFeaturedProducts.rejected(null, '', null, 'Failed'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed');
  });
});

describe('fetchNewArrivals thunk', () => {
  it('sets loading on pending', () => {
    const state = homeReducer(initialState, fetchNewArrivals.pending());
    expect(state.loading).toBe(true);
  });

  it('sets new arrivals on fulfilled', () => {
    const payload = { data: [{ _id: '2', name: 'Product 2', price: 49.99 }] };
    const state = homeReducer(initialState, fetchNewArrivals.fulfilled(payload));
    expect(state.newArrivals).toEqual(payload.data);
    expect(state.loading).toBe(false);
  });
});

describe('fetchCategories thunk', () => {
  it('sets categories on fulfilled', () => {
    const payload = { data: [{ _id: 'cat1', name: 'Electronics' }] };
    const state = homeReducer(initialState, fetchCategories.fulfilled(payload));
    expect(state.categories).toEqual(payload.data);
  });
});

describe('fetchActivePromotions thunk', () => {
  it('sets promotions on fulfilled', () => {
    const payload = { data: [{ _id: 'promo1', title: 'Summer Sale' }] };
    const state = homeReducer(initialState, fetchActivePromotions.fulfilled(payload));
    expect(state.promotions).toEqual(payload.data);
  });
});
