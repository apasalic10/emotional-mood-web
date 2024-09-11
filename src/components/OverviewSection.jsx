import React from 'react';
import { Link } from 'react-router-dom';
import Section from './Section.jsx';

const colorClasses = {
  blue: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
  green: 'bg-green-100 hover:bg-green-200 text-green-800',
  yellow: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
  purple: 'bg-purple-100 hover:bg-purple-200 text-purple-800',
};

const OverviewCard = ({ title, count, color, link }) => (
  <Link
    to={link}
    className={`p-4 rounded-lg transition-colors duration-200 ${colorClasses[color]}`}
  >
    <h3 className="font-semibold">{title}</h3>
    <p className={`text-2xl font-bold text-${color}-600`}>{count}</p>
  </Link>
);

const OverviewSection = ({ users, emotions, activities, educationMaterials }) => (
  <Section title="Pregled podataka" gridCols={4}>
    <OverviewCard title="Ukupno korisnika" count={users?.length ?? 0} color="blue" link="/users" />
    <OverviewCard
      title="Ukupno emocija"
      count={emotions?.length ?? 0}
      color="green"
      link="/emotions"
    />
    <OverviewCard
      title="Ukupno aktivnosti"
      count={activities?.length ?? 0}
      color="yellow"
      link="/activities"
    />
    <OverviewCard
      title="Ukupno edukativnih materijala"
      count={educationMaterials?.length ?? 0}
      color="purple"
      link="/resources"
    />
  </Section>
);

export default OverviewSection;
