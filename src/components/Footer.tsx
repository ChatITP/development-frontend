import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center p-4 border-t border-neutral-200">
      <div className="container mx-auto">
        <p>© {currentYear}.</p>
      </div>
    </footer>
  );
};

export default Footer;
