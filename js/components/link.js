/**
 * Type: app-link
 * Name: app
 * Author: PVT
 * Role: Link
 * Version: 1.0.0
 */

Vue.component('app-link', {

    /**
     * template
     */
    template: `
        <g>
            <line @click="select" :class="{selected:link.selected}" :x1="pos('origin','x')" :y1="pos('origin','y')"
                  :x2="pos('target','x')" :y2="pos('target','y')"></line>
        </g>
    `,

    /**
     * props
     */
    props: {
        link: Object
    },

    /**
     * data
     */
    data() {
        return {}
    },

    /**
     * created
     */
    created() {

    },

    /**
     * methods
     */
    methods: {

        /**
         * set pos for link
         * @param from
         * @param dir
         * @returns {*}
         */
        pos(from, dir) {
            return this.link[from].element[dir] + this.link[from].area[dir];
        },

        /**
         * select link
         */
        select() {
            EventBus.$emit('select-link', this.link);
        }
    }
});
