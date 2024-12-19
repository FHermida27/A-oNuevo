import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cld, cloudConfig } from '../config/cloudinary';

function Recuerdos() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Inicializar el widget después de que el script se haya cargado
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
          maxFiles: 1,
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#0078FF',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#0078FF',
              action: '#FF620C',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#0078FF',
              complete: '#20B832',
              sourceBg: '#E4EBF1'
            }
          }
        },
        (error, result) => {
          if (error) {
            console.error('Error en la subida:', error);
            setIsLoading(false);
          }
          if (result && result.event === 'success') {
            console.log('Subida exitosa:', result.info);
            setMemories(prev => [{
              id: result.info.public_id,
              imageUrl: result.info.secure_url,
              text: result.info.context?.caption || '',
              timestamp: new Date().toISOString()
            }, ...prev]);
            setIsLoading(false);
          }
        }
      );
      uploadWidget.open();
    } else {
      console.error('El widget de Cloudinary no está disponible');
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
          {isLoading ? 'Subiendo...' : '📸 Compartir un Recuerdo'}
        </button>

        <div className="memories-grid">
          {memories.map((memory) => (
            <div key={memory.id} className="memory-card">
              <img src={memory.imageUrl} alt="Recuerdo familiar" />
              {memory.text && <p>{memory.text}</p>}
              <small>{new Date(memory.timestamp).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Recuerdos; 