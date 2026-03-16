import { api, setAuthToken } from '@/services/api';

describe('api instance', () => {
  it('uses the correct base URL', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:3333');
  });

  it('has a 10 second timeout', () => {
    expect(api.defaults.timeout).toBe(10000);
  });

  it('defaults to JSON content type', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});

describe('setAuthToken', () => {
  const getInterceptor = () =>
    (api.interceptors.request as any).handlers.find(Boolean).fulfilled;

  afterEach(() => {
    setAuthToken(null);
  });

  it('adds the Authorization header when a token is set', () => {
    setAuthToken('my-secret-token');
    const config = getInterceptor()({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer my-secret-token');
  });

  it('does not add Authorization header when token is null', () => {
    setAuthToken(null);
    const config = getInterceptor()({ headers: {} });
    expect(config.headers.Authorization).toBeUndefined();
  });

  it('replaces a previously set token with the new one', () => {
    setAuthToken('first-token');
    setAuthToken('second-token');
    const config = getInterceptor()({ headers: {} });
    expect(config.headers.Authorization).toBe('Bearer second-token');
  });
});
