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
        alert(data.message);
        // Refresh items list
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
    <div style={{ padding: '20px' }}>
      <h2>Add Person Form</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input 
          type="text" 
          placeholder="Full Name" 
          value={formData.full_name}
          onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
        />
        <input 
          type="text" 
          placeholder="Phone Number (10 digits)" 
          value={formData.phone_number}
          onChange={e => setFormData({ ...formData, phone_number: e.target.value })} 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })} 
        />
        <button type="submit">Submit</button>
      </form>

      <h3>Person List</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', textAlign: 'left' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Full Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Phone Number</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {items.map((person, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{person.full_name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{person.phone_number}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{person.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;