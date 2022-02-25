import { useDrag } from "react-dnd";

export const useDragWrapper = (itemType, index, name, onDragEnd) => {
    const [collectedProps, drag] = useDrag({
        type: itemType,
        item: { index, name },
        end: onDragEnd,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return [collectedProps, drag];
};

export default useDragWrapper;