import React from 'react';

export default function App() {
  // Replace the URL below with your actual image link
  const imageUrl = "https://via.placeholder.com/240";

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.cardContainer}>
        {/* Header / Navigation Bar */}
        <header style={styles.navbar}>
          <div style={styles.title}>Maniraj Tiwari</div>
          <nav style={styles.navButtons}>
            <button style={styles.button} onClick={() => alert('About section')}>
              About
            </button>
            <button style={styles.button} onClick={() => alert('Project section')}>
              Project
            </button>
          </nav>
        </header>

        {/* Main Content / Center Image */}
        <main style={styles.mainContent}>
          <img 
            src={imageUrl} 
            alt="Profile or Project Illustration" 
            style={styles.centerImage} 
          />
        </main>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: '20px',
    boxSizing: 'border-box',
  },
  cardContainer: {
    fontFamily: '"Comic Sans MS", "Chalkboard SE", "Caveat", cursive, sans-serif',
    border: '2px solid #1a1a1a',
    borderRadius: '24px',
    padding: '24px 32px',
    width: '100%',
    maxWidth: '800px',
    height: '520px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    boxSizing: 'border-box',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  navButtons: {
    display: 'flex',
    gap: '12px',
  },
  button: {
    padding: '8px 20px',
    fontSize: '1rem',
    border: '2px solid #1a1a1a',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'background-color 0.2s ease, transform 0.1s ease',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerImage: {
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    border: '2px solid #1a1a1a',
    objectFit: 'cover',
  },
};