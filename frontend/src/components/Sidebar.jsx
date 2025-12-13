import React, { useState } from 'react';

function Sidebar({ onFilterChange = () => { }, selectedFilters = {} }) {
  const [expanded, setExpanded] = useState({
    category: true,
    skills: true
  });

  const toggleSection = (section) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (category) => {
    const currentCategories = selectedFilters.categories || [];
    let newCategories;

    if (currentCategories.includes(category)) {
      // Remove category
      newCategories = currentCategories.filter(c => c !== category);
    } else {
      // Add category
      newCategories = [...currentCategories, category];
    }

    onFilterChange({
      ...selectedFilters,
      categories: newCategories
    });
  };

  const handleSkillChange = (skill) => {
    const currentSkills = selectedFilters.skills || [];
    let newSkills;

    if (currentSkills.includes(skill)) {
      // Remove skill
      newSkills = currentSkills.filter(s => s !== skill);
    } else {
      // Add skill
      newSkills = [...currentSkills, skill];
    }

    onFilterChange({
      ...selectedFilters,
      skills: newSkills
    });
  };

  const handleClearAll = () => {
    // Reset all filters to empty/default state
    onFilterChange({
      categories: [],
      skills: [],
      distance: null
    });
  };

  return (
    <aside className="sidebar" style={styles.sidebar}>
      <div style={styles.header}>
        <h3 style={styles.title}>Filter By</h3>
        <button
          onClick={handleClearAll}
          style={styles.clearButton}
        >
          Clear All Filters
        </button>
      </div>

      {/* CATEGORY SECTION */}
      <div style={styles.section}>
        <div
          style={styles.sectionHeader}
          onClick={() => toggleSection('category')}
        >
          <span style={styles.arrow}>{expanded.category ? '▼' : '▶'}</span>
          <span style={styles.sectionTitle}>Cause / Category</span>
        </div>

        {expanded.category && (
          <div style={styles.options}>
            {['cultural', 'environmental', 'health', 'education', 'community service', 'other'].map(category => (
              <label key={category} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedFilters.categories?.includes(category) || false}
                  onChange={() => handleCategoryChange(category)}
                  style={styles.checkbox}
                />
                <span style={styles.labelText}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* SKILLS SECTION */}
      <div style={styles.section}>
        <div
          style={styles.sectionHeader}
          onClick={() => toggleSection('skills')}
        >
          <span style={styles.arrow}>{expanded.skills ? '▼' : '▶'}</span>
          <span style={styles.sectionTitle}>Skills Required</span>
        </div>

        {expanded.skills && (
          <div style={styles.options}>
            {['Leadership', 'Teaching', 'Physical Labor', 'Technical', 'Creative', 'Administrative'].map(skill => (
              <label key={skill} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedFilters.skills?.includes(skill) || false}
                  onChange={() => handleSkillChange(skill)}
                  style={styles.checkbox}
                />
                <span style={styles.labelText}>{skill}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px', // Slightly more rounded
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Cleaner shadow
    height: 'fit-content',
    border: '1px solid #eaeaea'
  },
  header: {
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '15px'
  },
  title: {
    margin: '0 0 15px 0',
    fontSize: '18px',
    fontWeight: '700',
    color: '#333'
  },
  clearButton: {
    padding: '8px 12px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    width: '100%',
    fontWeight: '600',
    transition: 'background 0.2s'
  },
  section: {
    marginBottom: '20px',
    borderBottom: '1px solid #f0f0f0',
    paddingBottom: '15px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 0',
    cursor: 'pointer',
    userSelect: 'none'
  },
  arrow: {
    marginRight: '10px',
    fontSize: '10px',
    color: '#666',
    width: '15px'
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: '15px',
    color: '#444'
  },
  options: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Force alignment to start
    cursor: 'pointer',
    userSelect: 'none',
    width: '100%',
    padding: '2px 0'
  },
  checkbox: {
    marginRight: '10px',
    cursor: 'pointer',
    width: '18px',
    height: '18px',
    accentColor: '#4f46e5' // Match theme color
  },
  labelText: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.4'
  }
};

export default Sidebar;