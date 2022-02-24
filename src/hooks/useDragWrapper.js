import { useDrag } from "react-dnd";

export const useDragWrapper = (itemType, index, name, changeItemColumn) => {
    // Make the item draggable. 
    const [collectedProps, drag] = useDrag({
        type: itemType,
        item: { index, name },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult();
            if (dropResult) {
                changeItemColumn(item, dropResult.name);
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return [collectedProps, drag];
};

export default useDragWrapper;