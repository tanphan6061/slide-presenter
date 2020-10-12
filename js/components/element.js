/**
 * Type: app-element
 * Name: app
 * Author: PVT
 * Role: Element
 * Version: 1.0.0
 */

Vue.component('app-element', {

    /**
     * template
     */
    template: `
        <div :style="pos" @click="moveToElement" class="element">
            <div class="element-group">
                <div class="control">
                    <button @click="removeElement" class="btn btn-danger">X</button>
                    <button @click="editElement" class="btn btn-warning">E</button>
                </div>
                <div @mousedown="dragElement" :style="circle" class="areas">
                    <div @click="addElement(area)" @mousedown="cloneStart(area,$event)" @mouseup="cloneEnd(area)"
                         :data-area="area.id" v-for="area in element.areas"><span>{{area.id}}</span></div>
                </div>
            </div>
        </div>
    `,

    /**
     * props
     */
    props: {
        element: Object
    },

    /**
     * data
     */
    data() {
        return {
            drag: {
                isMove: false,
                x: null,
                y: null
            }
        }
    },

    /**
     * methods
     */
    methods: {

        /**
         * move to element ( in view mode)
         */
        moveToElement() {
            if (this.$router.history.current.name == 'view')
                EventBus.$emit('move-to-element', this.element);
        },

        /**
         * add element
         * @param area
         * @returns {boolean}
         */
        addElement(area) {
            if (this.drag.isMove == true) {
                return this.drag.isMove = false;
            }
            EventBus.$emit('add-element', this.element, area);
        },

        /**
         * remove element
         */
        removeElement() {
            EventBus.$emit('remove-element', this.element);
        },

        /**
         * edit element
         */
        editElement() {
            EventBus.$emit('edit-element', this.element);
        },

        /**
         * drag element
         * @param pageX
         * @param pageY
         */
        dragElement({pageX, pageY}) {
            this.drag.x = pageX;
            this.drag.y = pageY;
            draggable(this.element, this.drag);
        },

        /**
         * clone start
         * @param area
         * @param e
         */
        cloneStart(area, e) {
            if (e.shiftKey) {
                e.stopPropagation();
                EventBus.$emit('make-clone', this.element, area, e);
            }
        },

        /**
         * clone end
         * @param area
         */
        cloneEnd(area) {
            EventBus.$emit('make-link', this.element, area);
        }
    },

    /**
     * computed
     */
    computed: {

        /**
         * set position for element
         * @returns {string}
         */
        pos() {
            return `left:${this.element.x - radius}px;top:${this.element.y - radius}px`;
        },

        /**
         * set with height for circle
         * @returns {{width: string, height: string}}
         */
        circle() {
            return {
                width: radius * 2 + 'px',
                height: radius * 2 + 'px',
            }
        }
    }
});
