import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cloudinaryUrl, cloudConfig } from '../config/cloudinary';

function Recuerdos() {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [imageUpload, setImageUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedMemories = JSON.parse(localStorage.getItem('memories') || '[]');
    setMemories(savedMemories);
  }, []);

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

        // Generar la firma
        const timestamp = formData.get('timestamp');
        const folder = 'memories';
        const stringToSign = `folder=${folder}&timestamp=${timestamp}${cloudConfig.apiSecret}`;
        const signature = await generateSignature(stringToSign);
        formData.append('signature', signature);

        const response = await fetch(cloudinaryUrl, {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error de Cloudinary:', errorData);
          throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        
        const newMemoryItem = {
          id: Date.now().toString(),
          imageUrl: data.secure_url,
          text: newMemory.trim(),
          timestamp: new Date().toISOString()
        };

        const updatedMemories = [...memories, newMemoryItem];
        setMemories(updatedMemories);
        localStorage.setItem('memories', JSON.stringify(updatedMemories));
        
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
              {memory.imageUrl && (
                <img src={memory.imageUrl} alt="Recuerdo familiar" />
              )}
              <p>{memory.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Recuerdos; 