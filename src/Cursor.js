import React, { useEffect } from 'react';
import './Cursor.css'; // Import CSS for cursor

const Cursor = () => {
  useEffect(() => {
    const cursor = document.querySelector('.cursor');

    const editCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    };

    
    window.addEventListener('mousemove', editCursor);

    // Cleanup event listeners on unmount
    return () => {
      
      window.removeEventListener('mousemove', editCursor);
    };
  }, []);

  return (
    <>
      <div className="cursor"></div>
    </>
  );
};

export default Cursor;
