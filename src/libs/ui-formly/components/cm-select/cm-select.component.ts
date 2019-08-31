import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CmFieldType } from '../cm-fieldType/cm-fieldType';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cm-select',
  templateUrl: './cm-select.component.html',
  styleUrls: ['./cm-select.component.scss']
})
export class CmSelectComponent extends CmFieldType implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('selectField') selectField;
  private subject: Subject<any>;

  public get defaultValue(): any {
    return this.getTemplateOptionField('defaultValue', '');
  }

  ngOnInit() {
    if (!this.model[this.key]) {
      this.formControl.setValue(this.defaultValue);
    }
    this.subject = new Subject<any>();
  }

  ngOnDestroy() {
    this.subject.next();
    this.subject.complete();
  }

  ngAfterViewInit() {
    if (this.to['debounce'] && !this.to['hidden']) {
      fromEvent(this.selectField.nativeElement, 'click')
        .pipe(
          debounceTime(this.to['debounce']),
          distinctUntilChanged(),
          takeUntil(this.subject)
        ).subscribe((event: MouseEvent) => {
          this.handleChange(event);
        });
    }
  }

  handleChange(event: MouseEvent) {
    console.log(event);
  }

}
