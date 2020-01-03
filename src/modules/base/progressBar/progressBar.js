import { LightningElement, api } from 'lwc';

export default class ProgressBar extends LightningElement {
    @api description;
    _progress = 0;

    @api
    set value(value) {
        this._progress = Math.round(value);
    }

    get value() {
        return this._progress;
    }

    get widthStyle() {
        return `width: ${this._progress}%`;
    }
}
