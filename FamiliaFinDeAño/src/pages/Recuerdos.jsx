import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cld, cloudConfig } from '../config/cloudinary';

function Recuerdos() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExistingImages();

    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.cloudinary) {
        console.log('Cloudinary widget loaded successfully');
      }
    };

    return () => {
      const existingScript = document.querySelector('script[src="https://upload-widget.cloudinary.com/global/all.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const fetchExistingImages = async () => {
    try {
      setIsLoading(true);
      
      // Lista de IDs de imágenes que sabemos que existen
      const knownImages = [
        {
          id: 'memories/hzjjj11vbsb8znznkruz',
          url: `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload/v1703030400/memories/hzjjj11vbsb8znznkruz`,
          timestamp: new Date('2024-12-19')
        },
        {
          id: 'memories/xzawhcgoqg12m2ctyliw',
          url: `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload/v1703030400/memories/xzawhcgoqg12m2ctyliw`,
          timestamp: new Date('2024-12-19')
        }
      ];

      setMemories(knownImages.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error al cargar las imágenes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openUploadWidget = () => {
    if (window.cloudinary) {
      setIsLoading(true);
      const uploadWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: cloudConfig.cloudName,
          uploadPreset: 'memories_preset',
          folder: 'memories',
          sources: ['local', 'camera'],
          multiple: false,
          maxFiles: 1
        },
        async (error, result) => {
          if (error) {
            console.error('Error en la subida:', error);
            setIsLoading(false);
          }
          if (result && result.event === 'success') {
            console.log('Subida exitosa:', result.info);
            // Añadir la nueva imagen al estado
            const newMemory = {
              id: result.info.public_id,
              url: result.info.secure_url,
              timestamp: new Date()
            };
            setMemories(prev => [newMemory, ...prev]);
            setIsLoading(false);
          }
        }
      );
      uploadWidget.open();
    } else {
      console.error('El widget de Cloudinary no está disponible');
      setIsLoading(false);
    }
  };

  return (
    <div className="memories-page">
      <Link to="/" className="back-button">
        ← Volver al inicio
      </Link>
      
      <section className="memories-section">
        <h2>Recuerdos Familiares 📸</h2>
        <button 
          onClick={openUploadWidget}
          disabled={isLoading}
          className="upload-button"
        >
          {isLoading ? 'Cargando...' : '📸 Compartir un Recuerdo'}
        </button>

        <div className="memories-grid">
          {memories.length === 0 && !isLoading && (
            <p>No hay recuerdos compartidos aún. ¡Sé el primero en compartir!</p>
          )}
          {memories.map((memory) => (
            <div key={memory.id} className="memory-card">
              <img src={memory.url} alt="Recuerdo familiar" loading="lazy" />
              <small>{memory.timestamp.toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Recuerdos; 