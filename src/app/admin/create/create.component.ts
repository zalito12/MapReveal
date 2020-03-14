import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { AdminDataService } from '../services/admin-data.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  public type: string = null;

  public formGroup: FormGroup;
  public formArray: FormArray;
  public file: any = {};
  public fileSrc: string = null;

  constructor(route: ActivatedRoute, private router: Router,private adminData: AdminDataService) {
    const fragment: string = route.snapshot.fragment;
    this.type = fragment;
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      name: new FormControl('', Validators.required),
      file: new FormControl('', Validators.required),
      stepThree: new FormGroup({
        color: new FormControl('#000000', Validators.required),
        touchAlert: new FormControl('true', Validators.required),
        write: new FormControl('false', Validators.required)
      }),
    });
  }

  public onFileSelected() {
    const inputNode: any = document.querySelector('#file');
    this.file = inputNode.files[0];
    if (FileReader && this.file) {
      var reader = new FileReader();
      reader.onload = e => {
        this.generateMap(e.target.result as string);
      };
      reader.onerror = e => {
        alert('File: ' + this.file.type);
      };
      reader.readAsDataURL(this.file);
    }
  }

  public save() {
    this.adminData.addMapp({
      name: this.formGroup.get('name').value,
      updated: new Date().getTime()
    });
    this.router.navigate(['admin']);
  }

  private generateMap(imageSrc: string) {
    this.fileSrc = imageSrc;
  }
}
