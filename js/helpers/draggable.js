/**
 * Type: Helper
 * Name: draggable
 * Author: PVT
 * Role: draggable element
 * Version: 1.0.0
 * @param item
 * @param drag
 */

const draggable = (item, drag = {}) => {
    /**
     * Drag Move
     * @param pageX
     * @param pageY
     */
    const dragMove = ({pageX, pageY}) => {
        if (drag.isMove != undefined)
            drag.isMove = true;
        item.x -= drag.x - pageX;
        item.y -= drag.y - pageY;

        drag.x = pageX;
        drag.y = pageY;
    };

    /**
     * Drag end
     */
    const dragEnd = () => {
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    };

    /**
     * Add event
     */
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
};