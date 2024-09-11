import React from 'react';
import Section from './Section.jsx';

const EducationMaterialsSection = ({ educationMaterials }) => {
  return (
    <Section title="Educational Resources" gridCols={1}>
      <div className="p-4 bg-white rounded-lg shadow">
        <ul className="divide-y divide-gray-200">
          {educationMaterials.map((material, index) => (
            <li key={index} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={material.imageUrl || 'https://via.placeholder.com/40'}
                    alt=""
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{material.title}</p>
                  <p className="text-sm text-gray-500 truncate">{material.description}</p>
                </div>
                <div>
                  <a
                    href={material.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                  >
                    View
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};

export default EducationMaterialsSection;
