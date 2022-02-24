import './App.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useRef, useState } from 'react';

// Movable Item Component 
const MovableItem = ({ name, setItems, index, moveCardHandler }) => {

  const changeItemColumn = (currentItem, columnName) => {
    setItems((prevState) => {
      return prevState.map(e => {
        return {
          ...e,
          column: e.name === currentItem.name ? columnName : e.column
        };
      });
    });
  };

  const ref = useRef();

  const [, drop] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCardHandler(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  // Make the item draggable. 
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { index, name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (dropResult && dropResult.name === 'Column 1') {
        changeItemColumn(item, 'Column 1')
      } else {
        changeItemColumn(item, 'Column 2');
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;

  drag(drop(ref));

  return (
    <div ref={ref} className='movable-item' style={{ opacity }}>
      {name}
    </div>
  )
}

// Column item component
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


// Main App Component
export const App = () => {

  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', column: 'Column 1' },
    { id: 2, name: 'Item 2', column: 'Column 1' },
    { id: 3, name: 'Item 3', column: 'Column 1' },
  ]);

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];

    if (dragItem) {
      setItems(prevState => {
        const copiedStateArray = [...prevState];
        // remove item by hover index and put "drag item" instead
        const prevItem = copiedStateArray.splice(hoverIndex, 1, dragItem);
        // remove item by drag index and put prev item instead 
        copiedStateArray.splice(dragIndex, 1, prevItem[0]);

        return copiedStateArray;
      });
    }
  };

  const returnItemsForColumn = (columnName) => {
    return items
      .filter(item => item.column === columnName)
      .map((item, index) => <MovableItem key={item.id} name={item.name} setItems={setItems} index={index} moveCardHandler={moveCardHandler} />);
  };

  return (
    <div className="container">
      <DndProvider backend={HTML5Backend}>
        <Column title='Column 1' className='column first-column'>
          {returnItemsForColumn('Column 1')}
        </Column>
        <Column title='Column 2' className='column second-column'>
          {returnItemsForColumn('Column 2')}
        </Column>
      </DndProvider>
    </div>
  );
}

export default App;
