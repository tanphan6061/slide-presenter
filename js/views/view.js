/**
 * Type: view-mode
 * Name: app
 * Author: PVT
 * Role: View mode
 * Version: 1.0.0
 */

const ViewMode = {

    /**
     * template
     */
    template: `
        <div class="mode view-mode">
            <div class="slide-container">
                <transition :name="dir">
                    <div class="slide" :key="currentElement.id" v-html="currentElement.content">
                    </div>
                </transition>
            </div>
            <transition name="control" mode="out-in">
                <div class="slide-controls" :key="currentElement.id">
                    <button v-if="area.link" v-for="(area,key) in currentElement.areas" class="btn btn-primary"
                            role="button" :tabindex="key+3" @click="changeSlide(area)" :key="area.id">
                        {{area.id}}. {{area.caption }}
                    </button>
                </div>
            </transition>
            <edit-mode class="mini-map" :currentElement="currentElement" :elements="elements" :links="links"></edit-mode>
        </div>
    `,

    /**
     * props
     */
    props: {
        elements: Array,
        links: Array
    },

    /**
     * data
     */
    data() {
        return {
            currentElement: this.elements[0],
            dir: 'fade'
        }
    },

    /**
     * Created
     */
    created() {
        // change mode and render full screen
        EventBus.$emit('change-mode', 'view');
        document.documentElement.requestFullscreen();

        // Add events to the control slide
        EventBus.$on('move-to-element', this.moveToElement);
        document.addEventListener('keydown', this.control);
    },

    /**
     * Methods
     */
    methods: {

        /**
         * change slide
         * @param area
         */
        changeSlide(area) {
            if (area.link) {
                let link = this.links.find(i => i.id == area.link);
                let {origin, target} = link;
                this.currentElement = origin.element.id == this.currentElement.id ? target.element : origin.element;
                this.dir = area.name;
            }
        },

        /**
         * change slide by key 1,2,3,4
         * @param key
         */
        control({key}) {
            if (this.$root.mode == 'view') {
                if (key < 1 || key > 4)
                    return;
                let area = this.currentElement.areas[key - 1];
                this.changeSlide(area);
            }
        },

        /**
         * Move to element
         * @param element
         */
        moveToElement(element) {
            this.currentElement = element;
            this.dir = 'fade';
        },
    },

    /**
     * Components
     */
    components: {
        'edit-mode': EditMode
    }
};
