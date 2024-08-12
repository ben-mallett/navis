import { getSdk } from 'balena-sdk';
import { beforeEach, afterAll } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';

beforeEach(() => {
    mockReset(balena);
});

afterAll(() => {
    mockReset(balena);
});

const balenaSDK = getSdk();
const balena = mockDeep<typeof balenaSDK>();

export default balena;
