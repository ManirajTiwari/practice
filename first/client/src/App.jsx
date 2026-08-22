import Signup from './components/Signup';
import Login from './components/Login';
import UpdateProfile from './components/UpdateProfile';
import Show from './components/show';

function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '2rem' }}>
      <h1>MERN Auth & Profile Forms</h1>
      
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'flex-start', 
        gap: '2rem', 
        flexWrap: 'wrap', 
        marginTop: '2rem' 
      }}>
        <Signup />
        <Login />
        <UpdateProfile />
        <Show />
      </div>
    </div>
  );
}

export default App;