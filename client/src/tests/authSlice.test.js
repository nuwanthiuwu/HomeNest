// /client/src/tests/authSlice.test.js
import authReducer, {
  clearError,
  registerUser,
  loginUser,
  logoutUser,
  fetchProfile,
} from '../store/authSlice';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

describe('authSlice reducers', () => {
  it('returns initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toMatchObject({
      user: null,
      loading: false,
      error: null,
    });
  });

  it('clearError sets error to null', () => {
    const state = { ...initialState, error: 'some error' };
    expect(authReducer(state, clearError()).error).toBeNull();
  });
});

describe('registerUser thunk', () => {
  it('sets loading true on pending', () => {
    const state = authReducer(initialState, registerUser.pending());
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('stores user and token on fulfilled', () => {
    const payload = { data: { user: { id: '1', name: 'Jane' }, token: 'tok123' } };
    const state = authReducer(initialState, registerUser.fulfilled(payload));
    expect(state.loading).toBe(false);
    expect(state.token).toBe('tok123');
    expect(state.user).toEqual({ id: '1', name: 'Jane' });
  });

  it('stores error on rejected', () => {
    const state = authReducer(initialState, registerUser.rejected(null, '', null, 'Email already in use'));
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Email already in use');
  });
});

describe('loginUser thunk', () => {
  it('sets loading true on pending', () => {
    const state = authReducer(initialState, loginUser.pending());
    expect(state.loading).toBe(true);
  });

  it('stores user and token on fulfilled', () => {
    const payload = { data: { user: { id: '1', name: 'Jane' }, token: 'tok456' } };
    const state = authReducer(initialState, loginUser.fulfilled(payload));
    expect(state.token).toBe('tok456');
    expect(state.user.name).toBe('Jane');
  });

  it('stores error on rejected', () => {
    const state = authReducer(initialState, loginUser.rejected(null, '', null, 'Invalid credentials'));
    expect(state.error).toBe('Invalid credentials');
    expect(state.loading).toBe(false);
  });
});

describe('logoutUser thunk', () => {
  it('clears user and token on fulfilled', () => {
    const loggedInState = { user: { name: 'Jane' }, token: 'tok', loading: false, error: null };
    const state = authReducer(loggedInState, logoutUser.fulfilled());
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.error).toBeNull();
  });
});

describe('fetchProfile thunk', () => {
  it('sets loading on pending', () => {
    const state = authReducer(initialState, fetchProfile.pending());
    expect(state.loading).toBe(true);
  });

  it('sets user data on fulfilled', () => {
    const payload = { data: { _id: '1', name: 'Jane', email: 'jane@test.com' } };
    const state = authReducer(initialState, fetchProfile.fulfilled(payload));
    expect(state.user).toEqual(payload.data);
    expect(state.loading).toBe(false);
  });

  it('sets error on rejected', () => {
    const state = authReducer(initialState, fetchProfile.rejected(null, '', null, 'Unauthorized'));
    expect(state.error).toBe('Unauthorized');
  });
});
