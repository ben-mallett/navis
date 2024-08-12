import { getSdk } from 'balena-sdk';

const balenaSDK = getSdk();
const globalForBalena = global as unknown as { balena: typeof balenaSDK };

const balena = globalForBalena.balena || getSdk();

if (process.env.NODE_ENV !== 'production') globalForBalena.balena = balena;

export default balena;
