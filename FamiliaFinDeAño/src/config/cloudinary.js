<<<<<<< HEAD
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'djyrs6m6v',
  api_key: '786883678979299',
  api_secret: '3chwELLYFi6kplq5ZOgoFWXr_po',
  secure: true
});

export default cloudinary;
=======
import { Cloudinary } from '@cloudinary/url-gen';

const cloudConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: 'memories_preset'
};

const cld = new Cloudinary({
  cloud: {
    cloudName: cloudConfig.cloudName
  }
});

export { cloudConfig, cld };
>>>>>>> b36a533 (primer intento)
