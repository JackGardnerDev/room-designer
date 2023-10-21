import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Check local storage for saved values. If not present, default values are set.
  const initialWidth = localStorage.getItem('rectangleWidth') || '500';
  const initialLength = localStorage.getItem('rectangleLength') || '500';
  const initialZoom = localStorage.getItem('zoomLevel') ? parseFloat(localStorage.getItem('zoomLevel')) : 1;
  const initialFurniture = JSON.parse(localStorage.getItem('furnitureData')) || [];

  // State for room dimensions, zoom, and furniture items.
  const [width, setWidth] = useState(initialWidth);
  const [length, setLength] = useState(initialLength);
  const [zoom, setZoom] = useState(initialZoom);
  const [furniture, setFurniture] = useState(initialFurniture);

  // Save room dimensions, zoom level, and furniture details to local storage when they change.
  useEffect(() => {
    localStorage.setItem('rectangleWidth', width);
    localStorage.setItem('rectangleLength', length);
    localStorage.setItem('zoomLevel', zoom.toString());
    localStorage.setItem('furnitureData', JSON.stringify(furniture));
  }, [width, length, zoom, furniture]);

  // const addFurniture = () => {
  //   const newFurniture = { id: Date.now(), name: '', length: '', width: '', x: 0, y: 0 };  // Added x, y default positions
  //   setFurniture([...furniture, newFurniture]);
  // };

  const addFurniture = () => {
    const newFurniture = { 
        id: Date.now(), 
        name: '', 
        length: '', 
        width: '', 
        x: '0', 
        y: '0' 
    };
    setFurniture([...furniture, newFurniture]);
  };  

  const updateFurniture = (id, field, value) => {
    setFurniture(furniture.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeFurniture = (id) => {
    setFurniture(furniture.filter(item => item.id !== id));
  };

  return (
    <div className="app">

      <div className="control-section">

        <h2>Measurements</h2>

        <button onClick={() => setZoom(prevZoom => Math.min(prevZoom + 0.1, 3))}>Zoom In</button>
        <button onClick={() => setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5))}>Zoom Out</button>

        <h3>Room:</h3>
        <div className="input-section">
          <div className="input-wrapper">
            <label htmlFor="width">Width (cm):</label>
            <input
              id="width"
              type="number"
              value={width}
              onChange={e => setWidth(Math.min(e.target.value, 2000))}
              placeholder="Width"
              max="2000"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="length">Length (cm):</label>
            <input
              id="length"
              type="number"
              value={length}
              onChange={e => setLength(Math.min(e.target.value, 2000))}
              placeholder="Length"
              max="2000"
            />
          </div>
        </div>

        <h3>Furniture</h3>

          {/* <button onClick={addFurniture}>+</button> */}
          
          {furniture.map(item => (
            <div key={item.id} className="furniture-section">
            <div className="name-input-group">
              <div className="input-wrapper standard-input">
                <label htmlFor={`name-${item.id}`}>Name:</label>
                <input 
                  id={`name-${item.id}`}
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => updateFurniture(item.id, 'name', e.target.value)}
                />
                </div>
                <button className="remove-button" onClick={() => removeFurniture(item.id)}>-</button>
              </div>
              
              <div className="dimension-input-group">
              <div className="input-wrapper">
                    <label htmlFor={`length-${item.id}`}>Length (cm):</label>
                    <input 
                        id={`length-${item.id}`}
                        type="number"
                        placeholder="Length"
                        value={item.length}
                        onChange={(e) => updateFurniture(item.id, 'length', Math.min(e.target.value, 2000))}
                        max="2000"
                    />
                </div>

                <div className="input-wrapper">
                    <label htmlFor={`width-${item.id}`}>Width (cm):</label>
                    <input 
                        id={`width-${item.id}`}
                        type="number"
                        placeholder="Width"
                        value={item.width}
                        onChange={(e) => updateFurniture(item.id, 'width', Math.min(e.target.value, 2000))}
                        max="2000"
                    />
                </div>
              </div>

              {/* New position input fields */}
              <div className="position-input-group">
              <div className="input-wrapper">
                    <label htmlFor={`x-${item.id}`}>X Position:</label>
                    <input 
                        id={`x-${item.id}`}
                        type="number"
                        placeholder="X"
                        value={item.x}
                        onChange={(e) => updateFurniture(item.id, 'x', Math.min(e.target.value, 1000))}
                        max="1000"
                    />
                </div>

                <div className="input-wrapper">
                    <label htmlFor={`y-${item.id}`}>Y Position:</label>
                    <input 
                        id={`y-${item.id}`}
                        type="number"
                        placeholder="Y"
                        value={item.y}
                        onChange={(e) => updateFurniture(item.id, 'y', Math.min(e.target.value, 1000))}
                        max="1000"
                    />
                </div>
              </div>

            </div>
          ))}

          <button onClick={addFurniture}>+</button>

      </div>
        
      <div className="rectangle-section">
        <div 
          className="rectangle-display"
          style={{
            transform: `translate(-50%, -50%) scale(${zoom})`
          }}
        >
          <div className="length-label">Room - {width} cm</div>
          <div
            className="rectangle"
            style={{
              width: `${width}px`,
              height: `${length}px`,
              border: '1px solid white',
              position: 'relative',
            }}
          >
            {furniture.map(item => (
              <div
                key={item.id}
                className="furniture-rectangle"
                style={{
                  width: `${item.length}px`,
                  height: `${item.width}px`,
                  border: '1px solid red',
                  position: 'absolute',
                  top: `${item.y}px`,       // Use the y value for positioning
                  left: `${item.x}px`,     // Use the x value for positioning
                }}
              >
                <div className="furniture-length-label">{item.name} - {item.length} cm</div> 
                <div className="furniture-width-label">{item.name} - {item.width} cm</div> 
              </div>
            ))}
          </div>
          <div className="width-label">Room - {length} cm</div>
        </div>

      </div>
    </div>
);
}

export default App;