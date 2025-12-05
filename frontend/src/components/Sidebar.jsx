import React, { useState } from 'react';

function Sidebar({ onFilterChange, selectedFilters = {} }) {
  const [expanded, setExpanded] = useState({
    category: true,
    skills: false,
    distance: false
  });

  // Categories with checkboxes
  const categories = [
    'Cultural',
    'Environmental',
    'Health',
    'Education',
    'Community Service',
    'Other'
  ];

  // Skills options
  const skills = [
    'Leadership',
    'Teaching',
    'Physical Labor',
    'Technical',
    'Creative',
    'Administrative'
  ];

  // Distance options
  const distances = [
    { label: '5 miles', value: 5 },
    { label: '10 miles', value: 10 },
    { label: '25 miles', value: 25 },
    { label: '50 miles', value: 50 },
    { label: '100+ miles', value: 100 }
  ];

  const toggleSection = (section) => {
    setExpanded({ ...expanded, [section]: !expanded[section] });
  };

  const handleCategoryChange = (category) => {
    const currentCategories = selectedFilters.categories || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    if (onFilterChange) {
      onFilterChange({ ...selectedFilters, categories: newCategories });
    }
  };

  const handleSkillChange = (skill) => {
    const currentSkills = selectedFilters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    
    if (onFilterChange) {
      onFilterChange({ ...selectedFilters, skills: newSkills });
    }
  };

  const handleDistanceChange = (distance) => {
    if (onFilterChange) {
      onFilterChange({ ...selectedFilters, distance });
    }
  };

  const clearAllFilters = () => {
    if (onFilterChange) {
      onFilterChange({});
    }
  };

  return (
    <aside className="sidebar">
      {/* CAUSE/CATEGORY SECTION */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px' }}>
        <div 
          onClick={() => toggleSection('category')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '10px 0',
            fontWeight: 'bold',
            fontSize: '16px',
            userSelect: 'none'
          }}
        >
          <span>— Cause/Category</span>
          <span style={{ fontSize: '12px' }}>{expanded.category ? '▼' : '▶'}</span>
        </div>
        
        {expanded.category && (
          <div style={{ marginTop: '10px' }}>
            {categories.map((category) => (
              <label 
                key={category} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.categories?.includes(category.toLowerCase()) || false}
                  onChange={() => handleCategoryChange(category.toLowerCase())}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                />
                {category}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SKILLS SECTION */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px' }}>
        <div 
          onClick={() => toggleSection('skills')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '10px 0',
            fontWeight: 'bold',
            fontSize: '16px',
            userSelect: 'none'
          }}
        >
          <span>— Skills</span>
          <span style={{ fontSize: '12px' }}>{expanded.skills ? '▼' : '▶'}</span>
        </div>
        
        {expanded.skills && (
          <div style={{ marginTop: '10px' }}>
            {skills.map((skill) => (
              <label 
                key={skill}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedFilters.skills?.includes(skill) || false}
                  onChange={() => handleSkillChange(skill)}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                />
                {skill}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* DISTANCE SECTION */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px' }}>
        <div 
          onClick={() => toggleSection('distance')}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            padding: '10px 0',
            fontWeight: 'bold',
            fontSize: '16px',
            userSelect: 'none'
          }}
        >
          <span>— Distance</span>
          <span style={{ fontSize: '12px' }}>{expanded.distance ? '▼' : '▶'}</span>
        </div>
        
        {expanded.distance && (
          <div style={{ marginTop: '10px' }}>
            {distances.map((dist) => (
              <label 
                key={dist.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 10px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                <input
                  type="radio"
                  name="distance"
                  checked={selectedFilters.distance === dist.value}
                  onChange={() => handleDistanceChange(dist.value)}
                  style={{ marginRight: '10px', cursor: 'pointer' }}
                />
                {dist.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* CLEAR FILTERS BUTTON */}
      <button
        onClick={clearAllFilters}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#ff5252',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          marginTop: '10px'
        }}
      >
        Clear All Filters
      </button>
    </aside>
  );
}

export default Sidebar;