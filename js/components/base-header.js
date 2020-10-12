/**
 * Type: base-header
 * Name: app
 * Author: PVT
 * Role: Header
 * Version: 1.0.0
 */
Vue.component('base-header', {

    /**
     * template
     */
    template: `
        <header class="bg-white d-flex align-items-center justify-content-between px-5 py-2 shadow-sm fixed-top">
            <router-link role="button" aria-label="Home page" tabindex="1" style="font-size: 28px;text-decoration: none"
                         :to="{name:'edit'}">Knowledge Explore
            </router-link>
            <div v-if="mode=='edit'">
                <router-link role="button" aria-label="View mode" tabindex="2" class="btn btn-success mx-2" :to="{name:'view'}">
                    View Mode
                </router-link>
                <button role="button" aria-label="Reset" tabindex="3" @click="reset" class="btn btn-danger">Reset</button>
            </div>
            <div v-if="mode=='view'">
                <router-link role="button" aria-label="Edit mode" tabindex="2" class="btn btn-warning" :to="{name:'edit'}">Edit
                    Mode
                </router-link>
            </div>
        </header>
    `,

    /**
     * props
     */
    props: {
        mode: String
    },

    /**
     * methods
     */
    methods: {

        /**
         * reset data
         */
        reset() {
            EventBus.$emit('reset');
            EventBus.$emit('set-alert', 'success', 'Successfully reset')
        }
    }
});
