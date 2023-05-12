class ProgressBar{
    constructor (element, intialValue = 0){
        this.valueElem = element.querySelector('.progress-bar-value');
        this.fillElem = element.querySelector('progress-bar-fill');

        this.setValue(intialValue);
    }

    setValue (newValue){
        if (newValue <0){
            newValue = 0;
        }

        if (newValue > 100){
            newValue = 100;
        }

        this.value = newValue;
        this.update();
    }

    update(){
        const nutrition = this.value + 'g';
        this.fillElem.style.with = nutrition;
        this.valueElem.textContent = nutrition;
    }
}

const pb1 = new ProgressBar(document.querySelector('.progress-bar'), 75);