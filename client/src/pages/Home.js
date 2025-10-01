import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      textAlign: 'center',
      padding: '40px'
    }}>
      <h1 style={{ fontSize: '56px', marginBottom: '20px', fontWeight: 'bold' }}>
        🍲 Recipe Recommender
      </h1>
      <p style={{ fontSize: '24px', marginBottom: '40px', maxWidth: '600px' }}>
        Discover, share, and cook amazing recipes from our community
      </p>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
        <Link 
          to="/recipes" 
          style={{ 
            padding: '16px 32px', 
            background: 'white', 
            color: '#667eea', 
            textDecoration: 'none', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            fontSize: '18px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}
        >
          Browse Recipes
        </Link>
        
        {isAuthenticated() ? (
          <Link 
            to="/add" 
            style={{ 
              padding: '16px 32px', 
              background: 'transparent', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold',
              fontSize: '18px',
              border: '2px solid white'
            }}
          >
            Submit Recipe
          </Link>
        ) : (
          <Link 
            to="/signup" 
            style={{ 
              padding: '16px 32px', 
              background: 'transparent', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold',
              fontSize: '18px',
              border: '2px solid white'
            }}
          >
            Get Started
          </Link>
        )}
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '40px', 
        maxWidth: '900px',
        marginTop: '40px'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>👨‍🍳</div>
          <h3 style={{ marginBottom: '10px' }}>Share Your Recipes</h3>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Submit your favorite recipes and share them with the community
          </p>
        </div>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
          <h3 style={{ marginBottom: '10px' }}>Quality Control</h3>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            All recipes are reviewed by admins to ensure quality
          </p>
        </div>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
          <h3 style={{ marginBottom: '10px' }}>Discover & Cook</h3>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            Browse approved recipes with detailed instructions
          </p>
        </div>
      </div>
    </div>
  );
}
