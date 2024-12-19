import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cloudinaryUrl, cloudConfig } from '../config/cloudinary';

function Recuerdos() {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      // Obtener todas las imágenes de la carpeta 'memories'
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudConfig.cloudName}/resources/image/upload?prefix=memories&max_results=500`,
        {
          headers: {
            Authorization: `Basic ${btoa(cloudConfig.apiKey + ':' + cloudConfig.apiSecret)}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener los recuerdos');
      }

      const data = await response.json();
      
      // Ordenar por fecha de creación (más recientes primero)
      const sortedMemories = data.resources
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
        formData.append('api_key', cloudConfig.apiKey);
        formData.append('timestamp', Math.round((new Date()).getTime() / 1000));
        formData.append('folder', 'memories');
        
        // Agregar el texto del recuerdo como metadatos
        if (newMemory.trim()) {
          formData.append('context', `caption=${newMemory.trim()}`);
        }

        // Generar la firma
        const timestamp = formData.get('timestamp');
        const folder = 'memories';
        const stringToSign = `context=caption=${newMemory.trim()}&folder=${folder}&timestamp=${timestamp}${cloudConfig.apiSecret}`;
        const signature = await generateSignature(stringToSign);
        formData.append('signature', signature);

        const response = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }

        // Recargar los recuerdos después de subir uno nuevo
        await fetchMemories();
        
        // Limpiar el formulario
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

  const generateSignature = async (stringToSign) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToSign);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  return (
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