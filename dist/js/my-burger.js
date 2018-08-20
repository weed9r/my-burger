'use strict';

const ENV_NAMESPACE = 'MyBurger';

(function (namespace) {

    /** make sure this is a singleton */
    if (namespace.burger) {
        return;
    }

    /**
     * private component variable decleration
     */
    const SELECTOR = '[data-burger]';
    const INSTANCE_KEY = 'burgerComponent';

    /** all variations of the burger - this dictionary will be needed! */
    const VARIATIONS = {
        DEFAULT: 'c-burger--initial',
        PLUS: 'c-burger--plus',
        CROSS: 'c-burger--cross',
        MINUS: 'c-burger--minus',
        ARROW_UP: 'c-burger--arrow-up',
        ARROW_DOWN: 'c-burger--arrow-down',
        ARROW_RIGHT: 'c-burger--arrow-right',
        ARROW_LEFT: 'c-burger--arrow-left'
    }
    /** all themes have to be declared here */
    const THEMES = {
        BRIGHT: 'c-burger--bright',
        DARK: 'c-burger--dark'
    }

    /**
     * Burger Class
     */
    class Burger {
        /**
         * @param {HTMLElement} node - The node of the burger icon.
         * @constructor
         */
        constructor(node) {
            this.node = node;
            this.callbacks = {};
            this.currentVariation = '';
            this.currentTheme = '';
            this.update();
        }

        /**
         * Sets the variant of the instance by the key of the dictionary of variations. 
         * If the key does not exists the funciton will set it back to a default.
         * 
         * @param {string} variant - The variant
         * @returns {void} - Returns nothing.
         * @public
         * */
        setVariant(variant) {
            if(typeof VARIATIONS[variant] === 'undefined') {
                variant = 'DEFAULT';
            }
            this.node.classList.remove(VARIATIONS[this.currentVariation]);
            this.node.classList.add(VARIATIONS[variant]);
            this.currentVariation = variant;
        }

        /**
         * Sets the theme of the burger instance. It also will match the param given to the funciton
         * with the dictionary for the themes. If they do not match it will set a default theme.
         * 
         * @param {string} theme - The theme of the burger menu.
         * @returns {void} - Returns nothing.
         * @public
         * */
        setTheme(theme) {
            if(typeof THEMES[theme] === 'undefined') {
                theme = 'BRIGHT';
            }
            this.node.classList.remove(THEMES[this.currentTheme]);
            this.node.classList.add(THEMES[theme]);
            this.currentTheme = theme;
        }

        /**
         * Updates the current data model and sets the current variant and the current theme based on
         * the registered node. This can be used if the data of this class does not match the DOM element anymore.
         * 
         * @returns {void} - Returns nothing.
         * @public
         * */
        update() {
            const currentClasses = this.node.classList;
            let hasVariant = false;
            let hasTheme = false;
            currentClasses.forEach(klass => {
                for (let key in VARIATIONS) {
                    if (klass === VARIATIONS[key]) {
                        this.currentVariation = key;
                        hasVariant = true;
                        break;
                    }
                }
                for (let key in THEMES) {
                    if (klass === THEMES[key]) {
                        this.currentTheme = key;
                        hasTheme = true;
                        break;
                    }
                }
            });
            if(!hasVariant) { this.setVariant('DEFAULT') }
            if(!hasTheme) { this.setTheme('BRIGHT') }
        }

        /**
         * Registeres a callback for the component based on the event. It will create a dictionary within the current instance
         * and apply the callback to it to call it when the event is triggered.
         * 
         * @param {string} event - The event when the callback will executed.
         * @param {function} callback - The function which will be executed.
         * @returns {void} - Returns nothing.
         * @public
         * */
        registerCallback(event, callback) {
            if (typeof this.callbacks[event] === 'undefined') {
                this.callbacks[event] = callback
            }
        }

        /**
         * Removes a callback from the dictionary by it's event key.
         * 
         * @param {string} event - The event where a callback is registered.
         * @returns {void} - Returns nothing.
         * @public
         * */
        removeCallback(event) {
            if (typeof this.callbacks[event] !== 'undefiend') {
                delete this.callbacks[event];
            }
        }
    }

    const burger = namespace.burgerComponent = {
        /**
         * An register of all initialized burger instances.
         */
        registered: [],
        /**
         * Init a instance of a burger.
         *
         * @param {HTMLElement} node - The node of the burger.
         * @param {object} callbacks - The callback config object.
         * @returns {Burger} - Returns the instance of the burger.
         * @public
         */
        init: function (node, callbacks) {
            if (node[INSTANCE_KEY] instanceof Burger) {
                console.warn('BurgerService::init(node) - Node allready initialized. Returning current instance');
                return; node[INSTANCE_KEY];
            }
            const instance = new Burger(node);
            node[INSTANCE_KEY] = instance;
            this.registered.push(instance);
            return instance;
        },
        /**
         * Scopes through the DOM and initializes all burgers with the data attribute declared in SELECTOR
         * 
         * @returns {Burger[]} - Returns an array with all registered burger instances.
         * @public
         */
        initAll: function () {
            console.log('register all');
            let registeredBurger = [];
            const allCurrentBurger = document.querySelectorAll(SELECTOR);
            allCurrentBurger.forEach(elm => {
                registeredBurger.push(this.init(elm));
            });
            console.log(registeredBurger);
            return registeredBurger;
        },
        /**
         * Calls the update method of the instace from the given node.
         *
         * @param {HTMLElement} node - The node to update.
         * @returns {void} - Returns nothing.
         * @public
         */
        update: function (node) {
            if (node[INSTANCE_KEY]) {
                node[INSTANCE_KEY].update();
            }
            console.warn('BurgerService::update(node) - Cannot update instance, node not initialized');
        },
        /**
         * Scopes through all registered instances and calls the update method.
         * 
         * @returns {void} - Returns nothing.
         * @public
         */
        updateAll: function () {
            this.registered.forEach(instance => {
                this.update(instance.node);
            });
        },
        /**
         * Destroys the instace of the given node. 
         *
         * @param {HTMLElement} node - The DOM node of the burger instance.
         * @returns {void} - Returns nothing.
         * @public
         */
        destroy: function (node) {
            if (node[INSTANCE_KEY]) {
                const index = this.registered.indexOf(node[INSTANCE_KEY]);
                if (index) {
                    this.registered.splice(index, 1);
                }
                delete node[INSTANCE_KEY];
            }
            throw new Error('BurgerService::destroy(node) - Cannot destroy instance, node not initialized');
        },
        /**
         * Scopes through all registered instances and destroys all.
         * 
         * @returns {void} - Returns nothing.
         * @public
         */
        destroyAll: function () {
            this.registered.forEach(instance => {
                this.destroy(instance.node);
            })
        },
        /**
         * Adds a callback to the data model of the instance for the given node.
         * 
         * @param {HTMLElement} node - The DOM node of the burger instance.
         * @param {string} event - The event when the callback has to be executed.
         * @param {funciton} callback - The funciton which has to be executed.
         * @returns {void} - Returns nothing.
         * @public
         */
        addCallback: function (node, event, callback) {
            if (node[INSTANCE_KEY]) {
                node[INSTANCE_KEY].addCallback(event, callback);
            }
            console.warn('BurgerService::addCallback(node, event, callback) - Cannot add callback. Node not initialized');
        },
        /**
         * Removes the callback from the data model of the burger instace.
         * 
         * @param {HTMLElement} node - The Dom node where the burger instance is bound with.
         * @param {string} event - The event which was registered.
         * @returns {void} - Returns nothing.
         * @public
         */
        removeCallback: function (node, event) {
            if (node[INSTANCE_KEY]) {
                node[INSTANCE_KEY].removeCallback(event, callback);
            }
            console.warn('BurgerService::removeCallback(node, event, callback) - Cannot remove callback. Node not initialized');
        },
        /**
         * Returns the burger instance of the given node.
         * 
         * @param {HTMLElement} node - The DOM node of the burger instance.
         * @returns {Burger|null} - Returns the instance if initialized, otherwise returns null.
         * @public
         */
        getInstanceByNode: function (node) {
            if (typeof node[INSTANCE_KEY] !== 'undefined') {
                if (node[INSTANCE_KEY] instanceof Burger) {
                    return node[INSTANCE_KEY];
                }
            }
            return null;
        },
        /**
         * Returns all variation keys.
         * 
         * @returns {object} - Returns all variations.
         */
        getVariations: function () {
            return VARIATIONS;
        },
        /**
         * Returns all theme keys.
         * 
         * @returns {object} - Reutrns all themes.
         */
        getThemes: function () {
            return THEMES;
        },
        /**
         * Sets a variant for a given node and it's instance.
         * 
         * @param {HTMLElement} node - The node of the burger.
         * @param {string} variant - The variant which will be set.
         * @returns {void} - Returns nothing.
         * @public
         */
        setVariant: function (node, variant) {
            if (node[INSTANCE_KEY]) {
                node[INSTANCE_KEY].setVariant(variant);
            }
        },
        /**
         * Sets the theme of the given node by its instance.
         *
         * @param {HTMLElement} node - The node of the burger menu.
         * @param {string} theme - The key of the dictionary for the themes.
         * @returns {void} - Returns nothing.
         * @public
         */
        setThemes: function (node, theme) {
            if (node[INSTANCE_KEY]) {
                node[INSTANCE_KEY].setTheme(theme);
            }
        }
    }

    burger.initAll();

}(window[ENV_NAMESPACE] || (window[ENV_NAMESPACE] = {})));
