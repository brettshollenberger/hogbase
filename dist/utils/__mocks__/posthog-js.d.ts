declare const posthog: {
    init: jest.Mock<any, any, any>;
    identify: jest.Mock<any, any, any>;
    capture: jest.Mock<any, any, any>;
    register: jest.Mock<any, any, any>;
    people: {
        set: jest.Mock<any, any, any>;
    };
};
export default posthog;
