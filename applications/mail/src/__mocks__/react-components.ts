export const useApi = jest.fn();

export const useEventManager = () => ({
    call: jest.fn(),
    subscribe: jest.fn()
});

export const useMailSettings = jest.fn();

export const classnames = jest.fn((...args) => args);

export const Loader = () => 'Loader';

export const useInstance = jest.fn((func) => func());
