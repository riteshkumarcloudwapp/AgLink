import React, { useState } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Card from './components/Card';

const Hero = () => {
  return (
    <section style={{
      padding: '150px 0 100px',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      textAlign: 'center'
    }}>
      <div className="container animate-fade">
        <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1rem', color: 'var(--dark)' }}>
          Fresh from <span style={{ color: 'var(--primary-dark)' }}>Fields</span> to your <span style={{ color: 'var(--primary-dark)' }}>Folder</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--gray)', maxWidth: '600px', margin: '0 auto 2rem' }}>
          The most premium marketplace for organic fruits and vegetables. Direct connection between farmers and you.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button style={{ padding: '15px 40px', background: 'var(--primary-dark)', color: 'white', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold' }}>
            Explore Products
          </button>
          <button style={{ padding: '15px 40px', background: 'white', color: 'var(--dark)', borderRadius: '30px', fontSize: '1.1rem', fontWeight: 'bold', border: '1px solid #e2e8f0' }}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

const MarketHome = () => {
  const products = [
    { title: 'Organic Spinach', description: 'Freshly harvested morning spinach.', price: '2.50' },
    { title: 'Red Tomatoes', description: 'Juicy organic vine-ripened tomatoes.', price: '3.99' },
    { title: 'Royal Apples', description: 'Sweet and crunchy gala apples.', price: '4.50' },
    { title: 'Green Broccoli', description: 'Rich in vitamins and minerals.', price: '2.80' },
  ];

  return (
    <div style={{ padding: '50px 0' }}>
      <div className="container">
        <h2 style={{ marginBottom: '2rem' }}>Featured Today</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {products.map((p, i) => (
            <Card key={i} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => (
  <div className="dashboard-layout animate-fade">
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <ul style={{ listStyle: 'none', marginTop: '2rem' }}>
        <li style={{ padding: '10px 0', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}>Dashboard Overview</li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}>Manage Users</li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}>Inventory</li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}>Order History</li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid var(--glass-border)', cursor: 'pointer' }}>Settings</li>
      </ul>
    </div>
    <div className="main-content">
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2>Dashboard Overview</h2>
        <div className="flex align-center gap-10">
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)' }}></div>
          <span>Admin User</span>
        </div>
      </header>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--gray)' }}>Total Sales</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>$12,450</h2>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--gray)' }}>Total Orders</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>84</h2>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <h4 style={{ color: 'var(--gray)' }}>New Customers</h4>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-dark)' }}>12</h2>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem', padding: '2rem' }}>
        <h3>Recent Orders</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--light)' }}>
              <th style={{ padding: '10px' }}>Order ID</th>
              <th style={{ padding: '10px' }}>Customer</th>
              <th style={{ padding: '10px' }}>Amount</th>
              <th style={{ padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px' }}>#ORD001</td>
              <td style={{ padding: '10px' }}>John Doe</td>
              <td style={{ padding: '10px' }}>$45.00</td>
              <td style={{ padding: '10px' }}><span style={{ color: 'green' }}>Delivered</span></td>
            </tr>
            <tr>
              <td style={{ padding: '10px' }}>#ORD002</td>
              <td style={{ padding: '10px' }}>Jane Smith</td>
              <td style={{ padding: '10px' }}>$22.50</td>
              <td style={{ padding: '10px' }}><span style={{ color: 'orange' }}>Pending</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('Market');

  return (
    <div className="App">
      {activeTab !== 'Admin' && <Navbar activeTab={activeTab} onTabChange={setActiveTab} />}

      {activeTab === 'Market' && (
        <>
          <Hero />
          <MarketHome />
        </>
      )}
      
      {activeTab === 'Admin' && <AdminDashboard />}
      
      {activeTab === 'Categories' && (
        <div className="container" style={{ padding: '100px 0' }}>
          <h2>Categories</h2>
          <p>Explore fruits, vegetables, and more.</p>
        </div>
      )}
      
      {activeTab === 'Shops' && (
        <div className="container" style={{ padding: '100px 0' }}>
          <h2>Our Partner Shops</h2>
          <p>Find the best local farmers.</p>
        </div>
      )}

      {activeTab !== 'Admin' && (
        <footer style={{ background: 'var(--dark)', color: 'white', padding: '50px 0', marginTop: '100px' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <h2>AgLink</h2>
            <p>Connect with Nature. Direct to Home.</p>
            <div style={{ marginTop: '20px', color: 'var(--gray)' }}>
              &copy; 2026 AgLink Marketplace. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
      );
}

      export default App;
