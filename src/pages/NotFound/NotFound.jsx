import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card glass-card">
        <div className="not-found-icon">
          <FileQuestion size={80} />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-text">
          Oops! The page you are looking for doesn't exist or has been moved.
          Let's get you back on track with your finances.
        </p>
        <Link to="/" className="btn btn-primary back-home-btn">
          <ArrowLeft size={18} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
