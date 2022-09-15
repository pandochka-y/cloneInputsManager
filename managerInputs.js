class managerInputs {
    defaultMaxItems = 2;
    templateRender = null;
    renderList = null;
    currentIndex = 0;
    itsSomeInputs = false;

    constructor(...args) {
        let el;
        let params;
        const calcMon = this
        if (!args.length) return false;
        [el, params] = args;
        if (!params) return false;
        el = this.searchContainer(el);
        if (!el) return false;
        params.el = el
        calcMon.params = Object.assign({}, params);
        this.init();
        return calcMon;
    }

    init() {
        const calcMon = this;
        calcMon.getBaseElements();
        calcMon.renderElements();
        calcMon.listenerButtonAdd();
    }

    listenerDelete(element) {
        const calcMon = this;
        const classButtonDelete = calcMon.params.classButtonDelete
        const button = element.querySelector(`${classButtonDelete}`)
        if (classButtonDelete) {
            console.log(classButtonDelete, button)
            button.addEventListener('click', () => {
                element.remove();
            })
        }
    }

    listenerButtonAdd() {
        const calcMon = this;
        if (!calcMon.params.classButtonAdd) return false;
        const form = calcMon.params.el
        const button = form.querySelector(`${calcMon.params.classButtonAdd}`)
        button.addEventListener('click', (e) => {
            e.preventDefault();
            if (!calcMon.itsSomeInputs) {
                if (calcMon.currentIndex < (calcMon.params.maxItems || calcMon.params.defaultMaxItems)) {
                    calcMon.renderElement();
                }
            } else {
                console.log('button')
                if (calcMon.currentIndex < (calcMon.params.maxItems || calcMon.params.defaultMaxItems)) {
                    calcMon.renderElement();
                }
            }
        })
    }

    listenerElement(e) {
        const calcMon = this;
        const renderClass = calcMon.params.classRender.slice(1, calcMon.params.classRender.length)
        const target = e.currentTarget
        const filledInputs = calcMon.getFilledInputs();
        if (!target.value) {
            if (calcMon.currentIndex > calcMon.params.initItems) {
                if (target.classList.contains(renderClass)) {
                    target.remove()
                    calcMon.currentIndex -= 1
                } else {
                    target.closest(`${calcMon.params.classRender}`).remove()
                    calcMon.currentIndex -= 1
                }
            }
        } else {
            if (calcMon.currentIndex < (calcMon.params.maxItems || calcMon.params.defaultMaxItems) && filledInputs) {
                calcMon.renderElement()
            }
        }
    }

    listenerInputGroup(e) {
        const calcMon = this;
        const isTotalFilled = calcMon.isTotalFilledGroup()
        const target = e.currentTarget
        const group = target.closest(calcMon.params.classRender)
        const {isEmpty, isFull, isNormal} = calcMon.getFilledGroupInputs(target)
        if (!target.value && isEmpty) {
            if (calcMon.currentIndex > calcMon.params.initItems) {
                group.remove()
                calcMon.currentIndex -= 1
            }
        } else {
            if (calcMon.currentIndex < (calcMon.params.maxItems || calcMon.params.defaultMaxItems) && isTotalFilled) {
                calcMon.renderElement()
            }
        }
    }

    isTotalFilledGroup() {
        const calcMon = this;
        const listGroup = calcMon.renderList.querySelectorAll(`input`);
        for (let input of listGroup) {
            if (!input.value) {
                return false
            }
        }
        return true
    }

    getFilledGroupInputs(input) {
        const calcMon = this
        const condition = {
            isEmpty: false,
            isFull: false,
            isNormal: false,
        }
        const group = input.closest(calcMon.params.classRender)
        const listInputs = Array.from(group.querySelectorAll('input'))
        let counter = 0;
        listInputs.forEach(item => {
            if (item.value) counter++
        })
        if (counter === 0)  condition.isEmpty = true
        if (counter === listInputs.length) {
            condition.isFull = true
        } else {
            condition.isNormal = true
        }
        return condition
    }

    getFilledInputs() {
        const calcMon = this
        const listInputs = calcMon.params.el.querySelectorAll(`${calcMon.params.classRender}`)
        let counter = 0;
        listInputs.forEach(input => {
            let element = input
            if (element.tagName !== 'INPUT') {
                element = input.querySelector('input')
            }
            if (element) {
                if (element.value) counter += 1
            }
        })
        return counter === calcMon.currentIndex
    }

    checkIndexingInput(input, test) {
        test = test + 2
        const calcMon = this;
        let name = input.name
        if (name.includes('indexing')) {
            name = name.replace('indexing', calcMon.currentIndex.toString())
        }
        return name
    }

    renderElement() {
        const calcMon = this;
        const element = calcMon.templateRender.cloneNode(true)
        if (element.tagName !== 'INPUT') {
            const listenerElements = element.querySelectorAll('input')
            const itsSome = listenerElements.length > 1
            calcMon.listenerDelete(element)
            listenerElements.forEach(input => {
                input.name = calcMon.checkIndexingInput(input);
                if (itsSome) {
                    calcMon.itsSomeInputs = true;
                    input.addEventListener('change', calcMon.listenerInputGroup.bind(calcMon));
                } else {
                    input.addEventListener('change', calcMon.listenerElement.bind(calcMon));
                }
            })
        } else {
            element.name = calcMon.checkIndexingInput(element);
            element.addEventListener('change', calcMon.listenerElement.bind(calcMon));
        }
        calcMon.renderList.insertAdjacentElement('beforeend', element)
        calcMon.currentIndex += 1
    }

    renderElements() {
        const calcMon = this
        let currentIndex = Number(calcMon.params.initItems)
        const maxItems = Number(calcMon.params.maxItems) || calcMon.params.defaultMaxItems
        if (currentIndex > maxItems) {
            currentIndex = maxItems
        }
        const totalRender = Array(currentIndex)
        for (let item of totalRender) {
            calcMon.renderElement()
        }
        calcMon.currentIndex = currentIndex
    }

    getBaseElements() {
        const calcMon = this;
        calcMon.getItemRender();
        calcMon.getRenderList();
    }

    getRenderList() {
        const calcMon = this;
        calcMon.renderList = calcMon.params.el.querySelector(`${calcMon.params.classListRender}`)
        calcMon.renderList.innerHTML = ''
    }

    getItemRender() {
        const calcMon = this;
        calcMon.templateRender = calcMon.params.el.querySelector(`${calcMon.params.classRender}`).cloneNode(true)
    }

    searchContainer(el) {
        const calcMon = this;
        if (!el) {
            return false
        }
        if (Object.prototype.toString.call(el).slice(8, -1) === 'HTMLFormElement') {
            return el
        } else if (typeof el === 'string') {
            return document.querySelector(`${el}`)
        } else {
            return false
        }
    }
}