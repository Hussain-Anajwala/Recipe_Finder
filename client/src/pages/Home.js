import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <>
      <style>{`
        .home-container {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-align: center;
          padding: 40px 20px;
        }

        .home-title {
          font-size: 56px;
          margin-bottom: 20px;
          font-weight: bold;
        }

        .home-subtitle {
          font-size: 24px;
          margin-bottom: 40px;
          max-width: 600px;
        }

        .home-buttons {
          display: flex;
          gap: 20px;
          margin-bottom: 60px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .home-btn {
          padding: 16px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          font-size: 18px;
          transition: transform 0.2s;
        }

        .home-btn:hover {
          transform: translateY(-2px);
        }

        .home-btn-primary {
          background: white;
          color: #667eea;
          box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        }

        .home-btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          max-width: 900px;
          margin-top: 40px;
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .feature-title {
          margin-bottom: 10px;
        }

        .feature-text {
          font-size: 14px;
          opacity: 0.9;
        }

        /* Responsive Design */
        @media screen and (max-width: 768px) {
          .home-container {
            padding: 30px 15px;
          }

          .home-title {
            font-size: 36px;
            margin-bottom: 15px;
          }

          .home-subtitle {
            font-size: 18px;
            margin-bottom: 30px;
          }

          .home-buttons {
            gap: 15px;
            margin-bottom: 40px;
          }

          .home-btn {
            padding: 14px 28px;
            font-size: 16px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            margin-top: 30px;
          }

          .feature-icon {
            font-size: 40px;
          }
        }

        @media screen and (max-width: 480px) {
          .home-title {
            font-size: 28px;
          }

          .home-subtitle {
            font-size: 16px;
          }

          .home-btn {
            padding: 12px 24px;
            font-size: 15px;
          }

          .features-grid {
            gap: 25px;
          }
        }
      `}</style>

      <div className="home-container">
        <h1 className="home-title">
          🍲 Recipe Recommender
        </h1>
        <p className="home-subtitle">
          Discover, share, and cook amazing recipes from our community
        </p>
        
        <div className="home-buttons">
          <Link to="/recipes" className="home-btn home-btn-primary">
            Browse Recipes
          </Link>
          
          {isAuthenticated() ? (
            <Link to="/add" className="home-btn home-btn-secondary">
              Submit Recipe
            </Link>
          ) : (
            <Link to="/signup" className="home-btn home-btn-secondary">
              Get Started
            </Link>
          )}
        </div>

        <div className="features-grid">
          <div>
            <div className="feature-icon">👨‍🍳</div>
            <h3 className="feature-title">Share Your Recipes</h3>
            <p className="feature-text">
              Submit your favorite recipes and share them with the community
            </p>
          </div>
          <div>
            <div className="feature-icon">✅</div>
            <h3 className="feature-title">Quality Control</h3>
            <p className="feature-text">
              All recipes are reviewed by admins to ensure quality
            </p>
          </div>
          <div>
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Discover & Cook</h3>
            <p className="feature-text">
              Browse approved recipes with detailed instructions
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
