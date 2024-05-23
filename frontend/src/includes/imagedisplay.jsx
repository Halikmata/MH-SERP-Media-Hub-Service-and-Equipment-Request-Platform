import React from 'react';

const ImageDisplay = ({ imageName }) => {
  const getImagePath = (imageName) => {
    const path = `/mh-serp-img/${imageName}.webp`; // Assuming all images are WebP format

    return path;
  };

  const imagePath = getImagePath(imageName);
  
  const imageStyle = {
    width: '100%',
    height: '100%',
    minWidth: '150px',
    maxWidth: '200px',
    minHeight: '150px',
    maxHeight: '200px',
    objectFit: 'cover',
    aspectRatio: '1 / 1', // Square aspect ratio
    backgroundColor: '#FFFFFF',
    borderRadius: '7px',
    boxShadow: '2px 2px 5px 1px rgba(51, 51, 51, 0.2)'
};

  return (
    <div>
      {imagePath && <img src={imagePath} style={imageStyle} alt={imageName} />}
    </div>
  );
};

export default ImageDisplay;