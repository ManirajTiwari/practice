import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({ 
    full_name: '', 
    phone_number: '', 
    email: '' 
  });

  // Fetch data from Django on load
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/person/')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  // Handle form submission to Django backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/person/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Saved successfully!');
        setItems([...items, formData]);
        setFormData({ full_name: '', phone_number: '', email: '' });
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
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
      <h2 style={{ color: '#1f2937', marginBottom: '20px', fontSize: '24px', fontWeight: '600' }}>Add Person Form</h2>
      
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
            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Phone Number</label>
          <input 
            type="text"
            placeholder="1234567890" 
            value={formData.phone_number}
            onChange={e => setFormData({ ...formData, phone_number: e.target.value })} 
            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#4b5563' }}>Email Address</label>
          <input 
            type="email" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })} 
            style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none', fontSize: '14px' }}
          />
        </div>

        <button type="submit" style={{ 
          gridColumn: 'span 2', 
          backgroundColor: '#4f46e5', 
          color: 'white', 
          padding: '12px', 
          borderRadius: '6px', 
          border: 'none', 
          fontWeight: '600', 
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}>
          Save Person
        </button>
      </form>

      <h3 style={{ color: '#1f2937', marginBottom: '16px', fontSize: '20px', fontWeight: '600' }}>Person List</h3>
      <div style={{ overflowX: 'auto', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Full Name</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Phone Number</th>
              <th style={{ padding: '12px 16px', fontWeight: '600' }}>Email</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '24px', textAlign: 'center', color: '#9ca3af' }}>No records found.</td>
              </tr>
            ) : (
              items.map((person, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #e5e7eb', color: '#4b5563' }}>
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