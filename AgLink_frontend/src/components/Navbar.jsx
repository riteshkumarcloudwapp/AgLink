import React from 'react';

const Navbar = ({ onTabChange, activeTab }) => {
  return (
    <nav className="glass" style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      height: '70px', 
      zIndex: 1000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: '0 50px' 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '35px', height: '35px', background: 'var(--primary)', borderRadius: '8px' }}></div>
        <h2 style={{ color: 'var(--dark)', fontWeight: '800', letterSpacing: '-1px' }}>AgLink</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '30px' }}>
        {['Market', 'Categories', 'Shops', 'Admin'].map(tab => (
          <span 
            key={tab}
            onClick={() => onTabChange(tab)}
            style={{ 
              cursor: 'pointer', 
              fontWeight: activeTab === tab ? '700' : '400',
              color: activeTab === tab ? 'var(--primary-dark)' : 'var(--dark)',
              position: 'relative',
              transition: 'var(--transition)'
            }}
          >
            {tab}
            {activeTab === tab && (
              <div style={{ 
                position: 'absolute', 
                bottom: '-5px', 
                left: 0, 
                width: '100%', 
                height: '2px', 
                background: 'var(--primary)' 
              }}></div>
            )}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '15px' }}>
        <button style={{ 
          padding: '8px 20px', 
          borderRadius: '20px', 
          background: 'var(--dark)', 
          color: 'white' 
        }}>
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
