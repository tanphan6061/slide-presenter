/**
 * Type: edit-mode
 * Name: app
 * Author: PVT
 * Role: Edit mode
 * Version: 1.0.0
 */

const EditMode = {

    /**
     * Template
     */
    template: `
        <div class="edit-mode">
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" id="links">
                <app-link v-for="link in links" :key="link.id" :link="link"></app-link>
            </svg>
            <div class="wrapper">
                <app-element :class="{'current-slide':currentElement!=undefined&&currentElement.id==element.id}"
                             :key="element.id" v-for="element in elements" :element="element"></app-element>
            </div>
            <transition name="modal">
                <app-modal v-if="showModal" :elementEdit="elementEdit"></app-modal>
            </transition>
            <div v-if="cloneElement.area" :style="setStyle" class="clone">{{cloneElement.area.id}}</div>
        </div>
    `,

    /**
     * props
     */
    props: {
        elements: Array,
        links: Array,
        currentElement: Object
    },

    /**
     * data
     */
    data() {
        return {
            cloneElement: {},
            showModal: false,
            elementEdit: {}
        }
    },

    /**
     * created
     */
    created() {
        // set mode
        if (this.$router.history.current.name == 'edit')
            EventBus.$emit('change-mode', 'edit');
        if (document.fullscreenElement)
            document.exitFullscreen();

        // add event for edit page
        EventBus.$on('make-clone', this.makeClone);

        EventBus.$on('make-link', this.makeLink);

        EventBus.$on('close-modal', this.closeModal);

        EventBus.$on('edit-element', this.editElement);
    },
    methods: {
        /**
         * make clone
         * @param element
         * @param area
         * @param e
         */
        makeClone(element, area, e) {
            let pos = {
                x: e.pageX,
                y: e.pageY
            };
            this.cloneElement = {element, area, pos};
            draggable(this.cloneElement.pos, {x: this.cloneElement.pos.x, y: this.cloneElement.pos.y});
            document.addEventListener('mouseup', this.removeClone);
        },

        /**
         * remove clone
         */
        removeClone() {
            this.cloneElement = {};
        },

        /**
         * make link
         * @param element
         * @param area
         */
        makeLink(element, area) {
            if (this.cloneElement.area) {
                EventBus.$emit('set-link', this.cloneElement.element, this.cloneElement.area, element, area);
            }
        },

        /**
         * close modal
         */
        closeModal() {
            this.showModal = false;
        },

        /**
         * open modal to edit element
         * @param element
         */
        editElement(element) {
            this.elementEdit = element;
            this.showModal = true;
        }
    },

    /**
     * computed
     */
    computed: {
        /**
         * set style for clone element
         * @returns {{top: string, left: string, width: string, height: string}}
         */
        setStyle() {
            let {x, y} = this.cloneElement.pos;
            x = x - radius / 3;
            y = y - radius / 3;
            return {
                width: radius / 1.5 + 'px',
                height: radius / 1.5 + 'px',
                left: x + 'px',
                top: y + 'px'
            }
        }
    }
};
