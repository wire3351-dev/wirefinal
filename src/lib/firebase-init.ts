import { productsData } from './products-data';
import { saveProduct } from './firebase-services';

export const initializeProductsInFirebase = async () => {
  try {
    console.log('Initializing products in Firebase...');

    for (const product of productsData) {
      await saveProduct(product);
    }

    console.log('Products initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing products:', error);
    return false;
  }
};
