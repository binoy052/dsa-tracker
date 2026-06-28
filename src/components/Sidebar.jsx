import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Code2, BookOpen, Trophy } from 'lucide-react';
import { dsaData } from '../data/questions';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Code2 size={20} />
        </div>
        <div className="sidebar-title">DSA Tracker</div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink 
          to="/" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          end
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>
        
        <div style={{ marginTop: '24px', marginBottom: '8px', padding: '0 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
          Categories
        </div>
        
        {dsaData.map((category) => (
          <NavLink 
            key={category.id}
            to={`/category/${category.id}`} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <BookOpen size={18} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {category.name}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
