import { useDrag } from "react-dnd";

export const useDragWrapper = (itemType, index, name, changeItemColumn) => {
    // Make the item draggable. 
    const [collectedProps, drag] = useDrag({
        type: itemType,
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

    return [collectedProps, drag];
};

export default useDragWrapper;