import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../material/material.module";
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [CommonModule, FormsModule,  MaterialModule]
})
export class SharedModule {}
