import React from 'react';

const Card = ({ title, description, image, price, onClick }) => {
  return (
    <div className="glass-card animate-fade" onClick={onClick}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', borderRadius: '20px 20px 0 0' }}>
        <img 
          src={image || 'https://via.placeholder.com/400x300?text=AgLink+Produce'} 
          alt={title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {price && (
          <div style={{ 
            position: 'absolute', 
            top: '10px', 
            right: '10px', 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '5px 15px', 
            borderRadius: '20px',
            fontWeight: 'bold',
            boxShadow: 'var(--shadow)'
          }}>
            ${price}
          </div>
        )}
      </div>
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--dark)' }}>{title}</h3>
        <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{description}</p>
        <button style={{ 
          marginTop: '1rem', 
          width: '100%', 
          padding: '0.8rem', 
          borderRadius: '10px', 
          background: 'var(--light)', 
          color: 'var(--primary-dark)',
          fontWeight: 'bold',
          border: '1px solid var(--primary)',
        }}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Card;
