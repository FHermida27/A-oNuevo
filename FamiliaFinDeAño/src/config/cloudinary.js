import { Cloudinary } from '@cloudinary/url-gen';

const cloudConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  uploadPreset: 'memories_preset',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
};

const cld = new Cloudinary({
  cloud: {
    cloudName: cloudConfig.cloudName
  },
  url: {
    secure: true
  }
});

export { cloudConfig, cld };

