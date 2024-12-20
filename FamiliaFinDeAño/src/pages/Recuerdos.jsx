import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cld, cloudConfig } from '../config/cloudinary';

function Recuerdos() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cargar imágenes inicialmente
    fetchExistingImages();

    // Configurar intervalo para actualizar cada 30 segundos
    const intervalId = setInterval(fetchExistingImages, 30000);

    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.cloudinary) {
        console.log('Cloudinary widget loaded successfully');
      }
    };

    // Limpiar intervalo y script al desmontar
    return () => {
      clearInterval(intervalId);
      const existingScript = document.querySelector('script[src="https://upload-widget.cloudinary.com/global/all.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const fetchExistingImages = async () => {
    try {
      setIsLoading(true);

      // Lista actualizada de imágenes que existen
      const knownImages = [
        {
          id: 'memories/du5wzext8ytearsz02sc',
          url: `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload/v1703030400/memories/du5wzext8ytearsz02sc`,
          timestamp: new Date('2024-12-20T12:00:00')
        },
        {
          id: 'memories/fzgiieawhq4iorslsyp4',
          url: `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload/v1703030400/memories/fzgiieawhq4iorslsyp4`,
          timestamp: new Date('2024-12-19T12:00:00')
        },
        {
          id: 'memories/w8mhm9kkndrvmrtzrnlw',
          url: `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload/v1703030400/memories/w8mhm9kkndrvmrtzrnlw`,
          timestamp: new Date('2024-12-19T12:00:00')
        },
        {
          id: 'memories/aaiubrueqbmxgygzxw14',
          url: `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload/v1703030400/memories/aaiubrueqbmxgygzxw14`,
          timestamp: new Date('2024-12-19T12:00:00')
        },
        {
          id: 'memories/hzjjj11vbsb8znznkruz',
          url: `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload/v1703030400/memories/hzjjj11vbsb8znznkruz`,
          timestamp: new Date('2024-12-19T12:00:00')
        },
        {
          id: 'memories/xzawhcgoqg12m2ctyliw',
          url: `https://res.cloudinary.com/${cloudConfig.cloudName}/image/upload/v1703030400/memories/xzawhcgoqg12m2ctyliw`,
          timestamp: new Date('2024-12-19T12:00:00')
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
            // Recargar todas las imágenes después de una subida exitosa
            await fetchExistingImages();
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
              <small>{memory.timestamp.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Recuerdos;