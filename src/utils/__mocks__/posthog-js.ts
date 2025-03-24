const posthog = {
  init: jest.fn(),
  identify: jest.fn(),
  capture: jest.fn(),
  register: jest.fn(),
  people: {
    set: jest.fn()
  }
};

export default posthog;
