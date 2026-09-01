import { useState, useEffect } from 'react';
import './App.css';

interface Person {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  image?: string;
}

function App() {
  const [items, setItems] = useState<Person[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ 
    full_name: '', 
    phone_number: '', 
    email: '' 
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState<number>(Date.now());

  const fetchPersons = () => {
    fetch('http://127.0.0.1:8000/api/person/')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSelectForEdit = (person: Person) => {
    setEditingId(person.id);
    setFormData({
      full_name: person.full_name,
      phone_number: person.phone_number,
      email: person.email,
    });
    setImagePreview(person.image || null);
    setImageFile(null);
    setFileInputKey(Date.now());
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ full_name: '', phone_number: '', email: '' });
    setImageFile(null);
    setImagePreview(null);
    setFileInputKey(Date.now());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    
    // We target the endpoint directly for PUT/POST operations
    const url = isEditing 
      ? `http://127.0.0.1:8000/api/person/${editingId}/` 
      : 'http://127.0.0.1:8000/api/person/';

    const payload = new FormData();
    payload.append('full_name', formData.full_name);
    payload.append('phone_number', formData.phone_number);
    payload.append('email', formData.email);
    
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: payload,
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message || (isEditing ? 'Updated successfully!' : 'Saved successfully!'));
        handleCancelEdit();
        fetchPersons();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/person/${editingId}/`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Deleted successfully!');
        handleCancelEdit();
        fetchPersons();
      } else {
        alert(JSON.stringify(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '40px auto', 
      padding: '30px', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f9fafb',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>
        {editingId ? 'Edit Person' : 'Add Person Form'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '16px', 
        marginBottom: '40px',
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe" 
            value={formData.full_name}
            onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Phone Number</label>
          <input 
            type="text" 
            placeholder="1234567890" 
            value={formData.phone_number}
            onChange={e => setFormData({ ...formData, phone_number: e.target.value })} 
            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })} 
            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '14px' }}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Profile Image</label>
          <input 
            key={fileInputKey}
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            style={{ padding: '8px 0', fontSize: '14px' }}
          />
          {imagePreview && (
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>
                {imageFile ? 'New file selected' : 'Current photo'}
              </span>
            </div>
          )}
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
          <button type="submit" style={{ 
            flex: 1,
            backgroundColor: editingId ? '#059669' : '#4f46e5', 
            color: 'white', 
            padding: '12px', 
            borderRadius: '6px', 
            border: 'none', 
            fontWeight: '600', 
            cursor: 'pointer'
          }}>
            {editingId ? 'Update Person' : 'Save Person'}
          </button>

          {editingId && (
            <>
              <button 
                type="button" 
                onClick={handleDelete}
                style={{ 
                  backgroundColor: '#dc2626', 
                  color: 'white', 
                  padding: '12px 20px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  fontWeight: '600', 
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
              <button 
                type="button" 
                onClick={handleCancelEdit}
                style={{ 
                  backgroundColor: '#9ca3af', 
                  color: 'white', 
                  padding: '12px 20px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  fontWeight: '600', 
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>

      <h3 style={{ color: '#1f2937', marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>
        Person List <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>(Click a row to edit)</span>
      </h3>

      <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Avatar</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Full Name</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Phone Number</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No records found.</td>
              </tr>
            ) : (
              items.map((person) => (
                <tr 
                  key={person.id} 
                  onClick={() => handleSelectForEdit(person)}
                  style={{ 
                    borderBottom: '1px solid #e5e7eb', 
                    color: '#4b5563',
                    cursor: 'pointer',
                    backgroundColor: editingId === person.id ? '#f3f4f6' : 'transparent'
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    {person.image ? (
                      <img 
                        src={person.image} 
                        alt={person.full_name} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '50%', 
                        backgroundColor: '#e5e7eb', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: '#9ca3af'
                      }}>
                        N/A
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>{person.full_name}</td>
                  <td style={{ padding: '12px 16px' }}>{person.phone_number}</td>
                  <td style={{ padding: '12px 16px' }}>{person.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;