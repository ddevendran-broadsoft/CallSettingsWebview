import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-desktop-select',
    templateUrl: 'desktopSelectDropdown.component.html',
})

/*This class prepares a multi-select checkbox for the application for desktop platform*/

export class DesktopSelectDropdownComponent implements AfterViewInit {
    @Input() selectOptionsList = [];
    @Input() inputContainer: string = '';
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() onDesktopSelectMenuHide: EventEmitter<boolean> = new EventEmitter<boolean>();

    customizedTextJson = window['customizedTexts'];

    ngAfterViewInit() {
        let self = this;
        document.addEventListener('click', function (event) {
            let selectContainer = document.getElementById('desktopSelectContainer');
            let inputContainer = document.getElementById(self.inputContainer);
            let isClickInside = (selectContainer && selectContainer.contains(<HTMLElement>event.target))
                || (inputContainer && inputContainer.contains(<HTMLElement>event.target));
            if (isClickInside) {
            } else {
                // this.removeEventListener('click');
                self.onDesktopSelectMenuHide.emit(false);
            }
        });
    }

    onSendCallsUpdateOptions(isSelectAll, isSelectNone) {

        let result = [];
        result = this.processOtherOption();
        this.onChange.emit(result);
    }

    processSelectAllOption() {
        let result = [];
        let selectAllOption = this.getSelectAllOption();
        let isAllSelected = selectAllOption.isChecked();
        this.selectOptionsList.forEach(option => {
            option.setChecked(isAllSelected);
            if (isAllSelected) {
                result.push(option.getName());
            }
        });
        return result;
    }

    processSelectNoneOption() {
        this.selectOptionsList.forEach(option => {
            if (!option.isNoneOption()) {
                option.setChecked(false);
            }
        });
        let self = this;
        setTimeout(function () {
            let selectNoneOption = self.getSelectNoneOption();
            selectNoneOption.setChecked(true);
        }, 50);
    }

    private processOtherOption() {
        let trueCount = 0, result = [], selectAllOption, selectNoneOption;
        for (let i = 0; i < this.selectOptionsList.length; i++) {
            if (!this.selectOptionsList[i].isSelectAllOption() && !this.selectOptionsList[i].isNoneOption()) {
                if (this.selectOptionsList[i].isChecked()) {
                    trueCount++;
                }
            }
        }
        result = this.getSelectedEntries();
        return result;
    }

    private getSelectedEntries() {
        let result = [];
        for (let i = 0; i < this.selectOptionsList.length; i++) {
            if (this.selectOptionsList[i].isChecked()) {
                result.push(this.selectOptionsList[i].getName());
            }
        }
        return result;
    }

    private getSelectAllOption() {
        let selectAllOption;
        for (let i = 0; i < this.selectOptionsList.length; i++) {
            if (this.selectOptionsList[i].isSelectAllOption()) {
                selectAllOption = this.selectOptionsList[i];
                break;
            }
        }
        return selectAllOption;
    }
    private getSelectNoneOption() {
        let selectNoneOption;
        for (let i = 0; i < this.selectOptionsList.length; i++) {
            if (this.selectOptionsList[i].isNoneOption()) {
                selectNoneOption = this.selectOptionsList[i];
                break;
            }
        }
        return selectNoneOption;
    }

}

export class DesktopSelectOption {
    private name: string = '';
    private checked: boolean = false;
    private selectAllOption: boolean = false;
    private selectNoneOption: boolean = false;
    constructor(name: string, flag: boolean) {
        this.name = name;
        this.checked = flag;
    }
    setName(name: string) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setChecked(flag: boolean) {
        this.checked = flag;
    }
    isChecked() {
        return this.checked;
    }
    isSelectAllOption() {
        return this.selectAllOption;
    }
    isNoneOption() {
        return this.selectNoneOption;
    }

}
