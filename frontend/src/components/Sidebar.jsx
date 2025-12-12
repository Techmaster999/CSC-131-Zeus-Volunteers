import React, { useState } from 'react';

function Sidebar({ onFilterChange = () => { }, selectedFilters = {} }) {
  const [expanded, setExpanded] = useState({
    category: true,
    skills: true,
    distance: false  // Collapsed by default since it's not working yet
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

  const handleDistanceChange = (distance) => {
    onFilterChange({
      ...selectedFilters,
      distance: distance
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

      {/* DISTANCE SECTION - DISABLED FOR NOW */}
      <div style={styles.section}>
        <div
          style={{ ...styles.sectionHeader, opacity: 0.5, cursor: 'not-allowed' }}
        >
          <span style={styles.arrow}>▶</span>
          <span style={styles.sectionTitle}>Distance (Coming Soon)</span>
        </div>

        {/* Commented out until Google Maps API is integrated
        {expanded.distance && (
          <div style={styles.options}>
            {[5, 10, 25, 50, 100].map(miles => (
              <label key={miles} style={styles.radioLabel}>
                <input
                  type="radio"
                  name="distance"
                  checked={selectedFilters.distance === miles}
                  onChange={() => handleDistanceChange(miles)}
                  style={styles.radio}
                />
                <span style={styles.labelText}>{miles}+ miles</span>
              </label>
            ))}
          </div>
        )}
        */}
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    height: 'fit-content'
  },
  header: {
    marginBottom: '20px',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '20px',
    fontWeight: 'bold'
  },
  clearButton: {
    padding: '8px 12px',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    width: '100%',
    fontWeight: 'bold'
  },
  section: {
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    cursor: 'pointer',
    userSelect: 'none'
  },
  arrow: {
    marginRight: '8px',
    fontSize: '12px',
    color: '#666'
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  options: {
    paddingLeft: '20px',
    marginTop: '10px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  checkbox: {
    marginRight: '8px',
    cursor: 'pointer'
  },
  radio: {
    marginRight: '8px',
    cursor: 'pointer'
  },
  labelText: {
    fontSize: '14px'
  }
};

export default Sidebar;