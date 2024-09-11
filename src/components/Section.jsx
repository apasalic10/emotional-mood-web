import React from 'react';

const Section = ({ title, children, gridCols = 3 }) => {
  const getGridClass = () => {
    switch (gridCols) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <section className="max-w-6xl p-6 mx-auto mb-6 bg-white rounded-lg shadow-md">
      {title && <h2 className="mb-4 text-2xl font-semibold text-gray-800">{title}</h2>}
      <div className={`w-full grid gap-6 ${getGridClass()}`}>{children}</div>
    </section>
  );
};

export default Section;
