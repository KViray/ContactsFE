import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ContactInterface } from '../contacts/contacts.component';

import { Router } from '@angular/router';
import { ContactService } from '../services/contactservice/contact.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.css']
})
export class AddContactsComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  subscription!: Subscription;
  _destroy: Subject<boolean> = new Subject<boolean>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: {title: string, updateContact: ContactInterface},  
              private fb: FormBuilder,
              private dialogRef: MatDialogRef<AddContactsComponent>, 
              public contactService: ContactService,
              private _router: Router) { }

  ngOnInit(): void {
    if(this.data.title === "Add")
    {
      this.form = this.fb.group({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        companyName: new FormControl('', Validators.required),
        mobileNumber: new FormControl('', [Validators.required,Validators.pattern("^[0-9]*$"),
                                            Validators.minLength(8)]),
        email: new FormControl('', [Validators.required, Validators.email])
      })
    }
    else if(this.data.title === "Update")
    {
      this.form = this.fb.group({
        firstName: new FormControl(this.data.updateContact.firstName, Validators.required),
        lastName: new FormControl(this.data.updateContact.lastName, Validators.required),
        companyName: new FormControl(this.data.updateContact.companyName, Validators.required),
        mobileNumber: new FormControl(this.data.updateContact.mobileNumber, [Validators.required,Validators.pattern("^[0-9]*$"),
                                            Validators.minLength(8)]),
        email: new FormControl(this.data.updateContact.email, [Validators.required, Validators.email])
      })
    }
  }

  onSubmit()
  {
    if(this.form.valid)
    {
      if(this.data.title === "Add")
      {
        this.contactService.addContacts(this.form.value).subscribe();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Successfully added contact',
        })
        this.dialogRef.close();
        this.reloadComponent()
      }
      else if(this.data.title === "Update")
      {
        this.contactService.updateContacts(this.data.updateContact.id, this.form.value)
        .subscribe();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Successfully updated contact',
        })
        this.dialogRef.close();
        this.reloadComponent()
      }
    }
  }
  reloadComponent() {
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigate(['']);
  }
cancel()
{
  this.dialogRef.close();
}
  ngOnDestroy(): void {
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
