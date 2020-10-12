/**
 * Type: app-modal
 * Name: app
 * Author: PVT
 * Role: Modal
 * Version: 1.0.0
 */

Vue.component('app-modal', {

    /**
     * template
     */
    template: `
        <div class="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Element</h5>
                        <button style="outline: none" @click="close" class="close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div ref="editor"></div>
                    </div>
                    <div class="modal-footer d-flex">
                        <div class="flex-grow-1 d-flex align-items-end p-2" v-for="area in elementEdit.areas">
                            <label :for="area.id" class="text-capitalize font-weight-bold mr-2">{{area.id}}. </label>
                            <input v-model="area.caption" v-if="area.link" :id="area.id" class="form-control"
                                   :value="area.caption" type="text">
                            <input v-else :id="area.id" class="form-control" value="No relation" type="text" disabled>
                        </div>
                    </div>
                </div>
            </div>
        </div>
   `,

    /**
     * props
     */
    props: {
        elementEdit: Object
    },

    /**
     * data
     */
    data() {
        return {}
    },

    /**
     * mounted
     */
    mounted() {
        this.editor = CKEDITOR.replace(this.$refs.editor);
        this.editor.setData(this.elementEdit.content);
        this.editor.on("change", _ => {
            this.elementEdit.content = this.editor.getData();
        })
    },

    /**
     * methods
     */
    methods: {

        /**
         * close modal
         */
        close() {
            EventBus.$emit('close-modal');
        }
    }
});
