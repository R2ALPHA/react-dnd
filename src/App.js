import './App.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';

const MovableItem = ({ setIsFirstColumn }) => {

  // Make the item draggable. 
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { name: 'Any custom name' },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.name === 'Column 1') {
        setIsFirstColumn(true);
      } else {
        setIsFirstColumn(false);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  return (
    <div ref={drag} className='movable-item' style={{ opacity }}>
      We will move this item
    </div>
  )
}

const Column = ({ children, className, title }) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    drop: () => ({ name: title }),
  });

  return (
    <div ref={drop} className={className}>
      {title}
      {children}
    </div>
  );
};

export const App = () => {

  const [isFirstColumn, setIsFirstColumn] = useState(true);
  const Item = <MovableItem setIsFirstColumn={setIsFirstColumn} />;

  return (
    <div className="container">
      <DndProvider backend={HTML5Backend}>
        <Column title='Column 1' className='column first-column'>
          {isFirstColumn && Item}
        </Column>
        <Column title='Column 2' className='column second-column'>
          {!isFirstColumn && Item}
        </Column>
      </DndProvider>
    </div>
  );
}

export default App;
