import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image, CloudinaryContext } from 'cloudinary-react';
import cloudinary from '../config/cloudinary';

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