import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { dsaData } from '../data/questions';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function Category() {
  const { categoryId } = useParams();
  const [progressData, setProgressData] = useLocalStorage('dsa-progress', {});
  
  const category = dsaData.find(c => c.id === categoryId);
  
  if (!category) {
    return <Navigate to="/" />;
  }

  const handleStatusChange = (problemId, status) => {
    setProgressData(prev => ({
      ...prev,
      [problemId]: prev[problemId] === status ? undefined : status
    }));
  };

  let solved = 0;
  category.problems.forEach(p => {
    if (progressData[p.id] === 'solved') solved++;
  });
  const percent = category.problems.length > 0 ? Math.round((solved / category.problems.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{category.name}</h1>
          <p className="page-subtitle">{category.description}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: percent === 100 ? 'var(--success)' : 'var(--text-primary)', lineHeight: 1 }}>
            {percent}%
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Completed</div>
        </div>
      </div>

      <div className="problem-list">
        {category.problems.map(problem => {
          const status = progressData[problem.id];
          
          return (
            <div key={problem.id} className="problem-item glass">
              <div className="problem-left">
                <button 
                  className={`problem-checkbox ${status === 'solved' ? 'solved' : status === 'review' ? 'review' : ''}`}
                  onClick={() => handleStatusChange(problem.id, status === 'solved' ? 'review' : 'solved')}
                  title="Toggle status (Solved -> Review -> Todo)"
                >
                  {status === 'solved' && <Check size={16} />}
                  {status === 'review' && <AlertTriangle size={16} />}
                </button>
                
                <div>
                  <a href={problem.url} target="_blank" rel="noopener noreferrer" className="problem-name">
                    {problem.name}
                  </a>
                  <div style={{ marginTop: '6px' }}>
                    <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="problem-actions">
                <a 
                  href={problem.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="action-btn"
                  title="Solve Problem"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
