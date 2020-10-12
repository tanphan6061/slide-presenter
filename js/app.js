/**
 * Type: Main Script
 * Name: app
 * Author: PVT
 * Role: main script
 * Version: 1.0.0
 */


/**
 * declare radius and distance
 * @type {number}
 */
const radius = 40;
const distance = radius * 4;

/**
 * Router
 */
const router = new VueRouter({
    routes
})

/**
 * Event Bus
 */
const EventBus = new Vue();

/**
 * Application
 */
new Vue({
    router,

    /**
     * data
     */
    data() {
        return {
            elements: [],
            links: [],
            alert: {
                type: '',
                mess: '',
                timer: null
            },
            mode: 'edit'
        }
    },

    /**
     * created
     */
    created() {
        // init data
        if (this.elements.length < 1)
            this.reset();
        this.getData();

        // add events

        EventBus.$on('add-element', this.addElement);

        EventBus.$on('remove-element', this.removeElement);

        EventBus.$on('reset', this.reset);

        EventBus.$on('set-alert', this.setAlert);

        EventBus.$on('select-link', this.selectLink);

        EventBus.$on('set-link', this.setLink);

        EventBus.$on('change-mode', this.changeMode);

        document.addEventListener('mouseup', this.unSelectAllLink);

        document.addEventListener('keydown', this.removeLink);
    },

    /**
     * methods
     */
    methods: {
        // =================== element ==================

        /**
         * create element
         * @param id
         * @param x
         * @param y
         * @returns {{x: *, y: *, areas: *[], id: *, content: string}}
         */
        createElement(id, x, y) {
            return {
                id, x, y,
                content: '<p><img alt="" src="images/kzn-2.jpg"></p><h4>Welcome</h4><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab atque commodi corporis delectus deleniti doloribus eius error ex illum, minus mollitia numquam obcaecati, officiis quos reiciendis, saepe sed tenetur vel!</p>',
                areas: [
                    {id: 1, related: 3, name: 'top', caption: 'Top title', x: 0, y: -radius},
                    {id: 2, related: 4, name: 'right', caption: 'Right title', x: radius, y: 0},
                    {id: 3, related: 1, name: 'bottom', caption: 'Bottom title', x: 0, y: radius},
                    {id: 4, related: 2, name: 'left', caption: 'Left title', x: -radius, y: 0},
                ]
            }
        },

        /**
         * add element
         * @param element
         * @param area
         */
        addElement(element, area) {
            if (area.link) {
                this.setAlert('danger', 'Already Relation');
                return;
            }
            let {x, y} = element;
            if (area.id == 1)
                y -= distance;
            else if (area.id == 2) {
                x += distance;
            } else if (area.id == 3) {
                y += distance;
            } else if (area.id == 4) {
                x -= distance;
            }

            let newElement = this.createElement(uuid(), x, y);
            this.elements.push(newElement);

            this.setLink(element, area, newElement, newElement.areas[area.related - 1]);
            this.setAlert('success', 'Make related element');
        },

        /**
         * delete element
         * @param element
         */
        removeElement(element) {
            if (element.id == 'root') {
                this.setAlert('danger', "Can't delete root element");
                return;
            }
            this.links = this.links.filter(({origin, target}) => {
                return origin.element.id != element.id && target.element.id != element.id
            });

            this.elements.splice(this.elements.indexOf(element), 1); // xóa node đó
            this.setAlert('success', "Deleted successfully");
        },

        // =================== link ==================

        /**
         * set links for 2 different elements
         * @param element1
         * @param area1
         * @param element2
         * @param area2
         * @returns {boolean}
         */
        setLink(element1, area1, element2, area2) {
            if (element1.id == element2.id) {
                this.setAlert('danger', 'You must link to another element');
                return false;
            }
            if (area1.link || area2.link) {
                this.setAlert('danger', 'Already Relation');
                return false;
            }
            let link = {
                id: uuid(),
                origin: {
                    element: element1,
                    area: area1
                },
                target: {
                    element: element2,
                    area: area2
                },
                selected: false
            };

            this.links.push(link);
            return true;
        },

        /**
         * select link to delete
         * @param link
         */
        selectLink(link) {
            link.selected = true;
            this.setAlert('success', 'selected link');
        },

        /**
         * unselect all link
         */
        unSelectAllLink() {
            this.links.forEach(i => i.selected = false);
        },

        /**
         * remove selected link
         * @param e
         */
        removeLink(e) {
            let {key} = e;

            if (key == 'Delete' || key == 'Backspace') {
                let link = this.links.find(i => i.selected == true);
                if (link) {
                    e.preventDefault();
                    this.links.splice(this.links.indexOf(link), 1);
                    this.setAlert('success', 'Deleted link');
                }
            }
        },

        // =================== update data ==================

        /**
         * Save data to local storage
         */
        saveData() {
            let links = this.links.map(link => {
                let {origin, target} = link;
                return Object.assign({}, link, {
                    origin: {
                        element: origin.element.id,
                        area: origin.area.id
                    },
                    target: {
                        element: target.element.id,
                        area: target.area.id
                    }
                })
            });

            localStorage.setItem('links', JSON.stringify(links));
            localStorage.setItem('elements', JSON.stringify(this.elements));
        },

        /**
         * get data from localstorage
         */
        getData() {
            let elements = localStorage.getItem('elements');
            let links = localStorage.getItem('links');

            this.elements = elements ? JSON.parse(elements) : this.elements;

            if (links) {
                links = JSON.parse(links);
                this.links = links.map(link => {
                    let {origin, target} = link;
                    let originElement = this.elements.find(i => i.id == origin.element);
                    let targetElement = this.elements.find(i => i.id == target.element);

                    return Object.assign({}, link, {
                        origin: {
                            element: originElement,
                            area: originElement.areas[origin.area - 1]
                        },
                        target: {
                            element: targetElement,
                            area: targetElement.areas[target.area - 1]
                        }
                    })
                })
            }
        },

        /**
         * reset data
         */
        reset() {
            this.elements = [this.createElement('root', window.innerWidth / 2, window.innerHeight / 2)];
            this.links = [];
        },

        /**
         * set data
         * @param type
         * @param mess
         */
        setAlert(type, mess) {
            this.alert.type = type;
            this.alert.mess = mess;
            clearTimeout(this.alert.timer);

            this.alert.timer = setTimeout(() => {
                this.alert.type = '';
                this.alert.mess = '';
            }, 4000)
        },

        /**
         * change mode
         * @param mode
         */
        changeMode(mode) {
            this.mode = mode;
        }
    },

    /**
     * computed
     */
    computed: {
        /**
         * Related elements
         * @returns {*}
         */
        relatedElements() {
            return this.elements.map(element => {
                let areas = element.areas.map(area => {
                    let link = this.links.find(({origin, target}) => {
                        return (
                            (origin.element.id == element.id && origin.area.id == area.id) ||
                            (target.element.id == element.id && target.area.id == area.id)
                        );
                    });
                    return Object.assign(area, {
                        link: link ? link.id : null
                    })
                });
                return Object.assign(element, {
                    areas
                })
            })
        }
    },

    /**
     * watch
     */
    watch: {
        /**
         * related elements
         */
        relatedElements: {
            deep: true,
            handler() {
                this.saveData();
            }
        }
    }
}).$mount('#app');
