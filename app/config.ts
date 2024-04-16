// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://zizzamia.xyz';

export const OP_EAS_ADDRESS = '0x4200000000000000000000000000000000000021';
