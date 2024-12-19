import { useState, useEffect } from 'react';
import { storage, db } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { v4 } from 'uuid';
import { Link } from 'react-router-dom';

function Recuerdos() {
  const [memories, setMemories] = useState([]);
  const [newMemory, setNewMemory] = useState('');
  const [imageUpload, setImageUpload] = useState(null);

  useEffect(() => {
    getMemories();
  }, []);

  const getMemories = async () => {
    const querySnapshot = await getDocs(collection(db, "memories"));
    const memoriesData = [];
    querySnapshot.forEach((doc) => {
      memoriesData.push({ id: doc.id, ...doc.data() });
    });
    setMemories(memoriesData);
  };

  const handleMemorySubmit = async (e) => {
    e.preventDefault();
    if (newMemory.trim() === '' && !imageUpload) return;

    let imageUrl = '';
    if (imageUpload) {
      const imageRef = ref(storage, `memories/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "memories"), {
      text: newMemory,
      imageUrl,
      createdAt: new Date().toISOString()
    });

    setNewMemory('');
    setImageUpload(null);
    getMemories();
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
          />
          <input
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
            accept="image/*"
          />
          <button type="submit">Compartir Recuerdo</button>
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