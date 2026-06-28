import React from 'react';
import { Link } from 'react-router-dom';
import { Target, CheckCircle2, AlertCircle } from 'lucide-react';
import { dsaData } from '../data/questions';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function Dashboard() {
  const [progressData] = useLocalStorage('dsa-progress', {});
  
  // Calculate stats
  let totalProblems = 0;
  let solvedProblems = 0;
  let reviewProblems = 0;
  
  dsaData.forEach(category => {
    totalProblems += category.problems.length;
    category.problems.forEach(p => {
      if (progressData[p.id] === 'solved') solvedProblems++;
      if (progressData[p.id] === 'review') reviewProblems++;
    });
  });

  const completionPercentage = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Track your DSA preparation progress</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="flex-between">
            <span className="stat-title">Total Progress</span>
            <Target size={20} className="text-accent" />
          </div>
          <span className="stat-value">{completionPercentage}%</span>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="stat-card glass success">
          <div className="flex-between">
            <span className="stat-title">Solved Problems</span>
            <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
          </div>
          <span className="stat-value">{solvedProblems} <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/ {totalProblems}</span></span>
        </div>
        
        <div className="stat-card glass warning">
          <div className="flex-between">
            <span className="stat-title">Needs Review</span>
            <AlertCircle size={20} style={{ color: 'var(--warning)' }} />
          </div>
          <span className="stat-value">{reviewProblems}</span>
        </div>
      </div>

      <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', fontWeight: 600 }}>Categories</h2>
      
      <div className="category-grid">
        {dsaData.map(category => {
          let catSolved = 0;
          category.problems.forEach(p => {
            if (progressData[p.id] === 'solved') catSolved++;
          });
          
          const catPercent = category.problems.length > 0 ? Math.round((catSolved / category.problems.length) * 100) : 0;
          
          return (
            <Link to={`/category/${category.id}`} key={category.id} className="category-card glass">
              <div className="category-card-header">
                <span className="category-card-title">{category.name}</span>
                <span style={{ fontWeight: 600, color: catPercent === 100 ? 'var(--success)' : 'inherit' }}>
                  {catPercent}%
                </span>
              </div>
              <p className="category-card-desc">{category.description}</p>
              
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${catPercent}%`, background: catPercent === 100 ? 'var(--success)' : '' }}></div>
              </div>
              
              <div className="category-card-meta">
                <span>{category.problems.length} Problems</span>
                <span>{catSolved} Solved</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
