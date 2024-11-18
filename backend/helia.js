import { createHelia } from 'helia';

const setupHelia = async () => {
  const helia = await createHelia(); // Helia with default blockstore
  console.log('Helia instance initialized');
  return helia;
};

export default setupHelia;
