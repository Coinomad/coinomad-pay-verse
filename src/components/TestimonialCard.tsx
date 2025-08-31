
import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, title, company, avatar }) => {
  return (
    <div className="bg-coinomad-card p-6 rounded-lg border border-coinomad-border">
      <p className="text-coinomad-textGray mb-6">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img src={avatar} alt={name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <p className="text-sm text-coinomad-textGray">{title}, {company}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
