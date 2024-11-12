export const mockTokens = {
  access_token: 'secret',
  refresh_token: 'secret',
};

export const mockAuthService = {
  signUp: jest.fn().mockResolvedValue(mockTokens),
  login: jest.fn().mockResolvedValue(mockTokens),
  loginGoogle: jest.fn().mockResolvedValue(mockTokens),
  refreshTokens: jest.fn().mockResolvedValue(mockTokens),
  logout: jest.fn().mockResolvedValue(undefined),
};
