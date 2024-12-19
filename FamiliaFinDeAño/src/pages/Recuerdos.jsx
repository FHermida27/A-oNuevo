import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import { Image, CloudinaryContext } from 'cloudinary-react';
import cloudinary from '../config/cloudinary';
=======
import { cld, cloudConfig } from '../config/cloudinary';
>>>>>>> b36a533 (primer intento)

function Recuerdos() {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cargar el script de Cloudinary Upload Widget
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

<<<<<<< HEAD
  const fetchMemories = async () => {
    try {
      const { resources } = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'memories',
        max_results: 500,
        context: true
      });

      const sortedMemories = resources
        .map(resource => ({
          id: resource.public_id,
          imageUrl: resource.secure_url,
          text: resource.context?.caption || '',
          timestamp: resource.created_at
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setMemories(sortedMemories);
    } catch (error) {
      console.error('Error al cargar los recuerdos:', error);
    }
  };

  const handleMemorySubmit = async (e) => {
    e.preventDefault();
    if (!imageUpload && !newMemory.trim()) return;
    
    setIsLoading(true);

    try {
      if (imageUpload) {
        const formData = new FormData();
        formData.append('file', imageUpload);
        formData.append('upload_preset', 'ml_default'); // Asegúrate de crear este preset en Cloudinary
        formData.append('folder', 'memories');
        
        if (newMemory.trim()) {
          formData.append('context', `caption=${newMemory.trim()}`);
        }

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/djyrs6m6v/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }

        await fetchMemories();
        setNewMemory('');
        setImageUpload(null);
      }
    } catch (error) {
      console.error('Error al subir el recuerdo:', error);
      alert('Error al subir el recuerdo. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CloudinaryContext cloudName="djyrs6m6v">
      <div className="memories-page">
        <Link to="/" className="back-button">
          ← Volver al inicio
        </Link>
        
        <section className="memories-section">
          <h2>Recuerdos Familiares 📸</h2>
          <form onSubmit={handleMemorySubmit}>
            <textarea
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              placeholder="Comparte un recuerdo especial..."
              disabled={isLoading}
            />
            <input
              type="file"
              onChange={(e) => setImageUpload(e.target.files[0])}
              accept="image/*"
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || (!imageUpload && !newMemory.trim())}>
              {isLoading ? 'Subiendo...' : 'Compartir Recuerdo'}
            </button>
          </form>
=======
  const openUploadWidget = () => {
    if (window.cloudinary) {
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
          if (!error && result && result.event === 'success') {
            // Actualizar la lista de memorias después de una subida exitosa
            setMemories(prev => [{
              id: result.info.public_id,
              imageUrl: cld.image(result.info.public_id)
                .format('auto')
                .quality('auto')
                .toURL(),
              text: result.info.context?.caption || '',
              timestamp: new Date().toISOString()
            }, ...prev]);
          }
        }
      );
      uploadWidget.open();
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
>>>>>>> b36a533 (primer intento)

          <div className="memories-grid">
            {memories.map((memory) => (
              <div key={memory.id} className="memory-card">
                <Image publicId={memory.id} width="300" crop="fill" />
                {memory.text && <p>{memory.text}</p>}
                <small>{new Date(memory.timestamp).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </section>
      </div>
    </CloudinaryContext>
  );
}

export default Recuerdos; 