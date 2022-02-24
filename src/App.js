import './App.css';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useState } from 'react';
import Column from './components/Column';
import MovableItem from './components/MovableItem';

import InitialTasks from './utils/InitialTasks';

// Main App Component
export const App = () => {

  const [items, setItems] = useState(InitialTasks);

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

  const returnItemsForColumn = (columnName) => {
    return items
      .filter(item => item.column === columnName)
      .map((item, index) => <MovableItem key={item.id} name={item.name} changeItemColumn={changeItemColumn} index={index} moveCardHandler={moveCardHandler} />);
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
