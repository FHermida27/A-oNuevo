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

