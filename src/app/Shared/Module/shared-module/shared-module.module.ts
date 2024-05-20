import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafehtmlPipe } from '../../Pipes/safehtml.pipe';
import { NameMaxPipe } from '../../Pipes/name-max-length.pipe';
import { NumbersOnlyDirective } from '../../Directive/numbers-only.directive';
import { NameFullLengthPipe } from '../../Pipes/name-full-length.pipe';
import { CharOnlyDirective } from '../../Directive/char-only.directive';
import { AmountNumberDirective } from '../../Directive/amount-number.directive';
import { TextMaxPipe } from '../../Pipes/text-max-length.pipe';
import { IntNumberDirective } from '../../Directive/int-number.directive';
import { InrPipe } from '../../Pipes/inr.pipe';



@NgModule({
  declarations: [
    SafehtmlPipe,
    NameMaxPipe,
    CharOnlyDirective,
    NumbersOnlyDirective,
    NameFullLengthPipe,
    TextMaxPipe,
    AmountNumberDirective,
    IntNumberDirective,
    InrPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    SafehtmlPipe,
    NameMaxPipe,
    CharOnlyDirective,
    NumbersOnlyDirective,
    NameFullLengthPipe,
    TextMaxPipe,
    AmountNumberDirective,
    IntNumberDirective,
    InrPipe
  ]
})
export class SharedModuleModule {

}
