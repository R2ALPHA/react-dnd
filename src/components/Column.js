import { useDrop } from "react-dnd";
import ItemTypes from "../utils/ItemTypes";

const Column = (props) => {

    const [, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: () => ({ name: props.title }),
    });

    return (
        <div ref={drop} className={props.className}>
            {props.title}
            {props.children}
        </div>
    );
};

export default Column;