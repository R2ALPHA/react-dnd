import { useRef } from "react";
import ItemTypes from "../utils/ItemTypes";
import useDropWrapper from "../hooks/useDropWrapper";
import useDragWrapper from "../hooks/useDragWrapper";

const MovableItem = ({ name, index, changeItemColumn, moveCardHandler }) => {

    const onDragEnd = (item, monitor) => {
        const dropResult = monitor.getDropResult();
        if (dropResult) {
            changeItemColumn(item, dropResult.name);
        }
    }

    const ref = useRef();
    const [, drop] = useDropWrapper(ItemTypes.CARD, index, moveCardHandler, ref);
    const [{ isDragging }, drag] = useDragWrapper(ItemTypes.CARD, index, name, onDragEnd);
    const opacity = isDragging ? 0.4 : 1;

    drag(drop(ref));

    return (
        <div ref={ref} className='movable-item' style={{ opacity }}>
            {name}
        </div>
    )
}

export default MovableItem;