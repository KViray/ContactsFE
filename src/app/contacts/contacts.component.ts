import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {  lastValueFrom, Subject, Subscription, takeUntil } from 'rxjs';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';
import { ContactService } from '../services/contact.service';
import Swal from 'sweetalert2';

export interface ContactInterface {
  id: number;
  firstName: string;
  lastName: string;
  companyName: string;
  mobileNumber: string;
  email: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnDestroy,OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'companyName', 'mobile','email', 'actions'];
  dataSource: MatTableDataSource<ContactInterface>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  subsciption!: Subscription;
  _destroy: Subject<boolean> = new Subject<boolean>();
  value = 0;
  constructor(public dialog: MatDialog, 
              public contactService: ContactService) { }

  async ngOnInit() {
    const getContacts = this.contactService.getContacts()
    const contactList = await lastValueFrom(getContacts);
    this.dataSource = new MatTableDataSource(contactList);
    this.value = this.dataSource.filteredData.length;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  }
  openDialog(title: string,id?: number,firstName?: string,lastName?: string,companyName?: string, mobileNumber?: string, email?: string,){
    var updateContact: ContactInterface = {
      id: id!,
      firstName: firstName!,
      lastName: lastName!,
      companyName: companyName!,
      mobileNumber: mobileNumber!,
      email: email!
    };

    this.dialog.open(AddContactsComponent, {
      width: '17%',
      height: '70%',
      data:{title: title, updateContact},
    });
  }
  search(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  deleteContact(id: number, contactName: string)
  {
    Swal.fire({
      title: 'Delete',
      text: 'Are you sure you want to delete ' + contactName +'?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        this.subsciption = this.contactService.deleteContact(id).subscribe();
      }
    })
    
  }
  ngOnDestroy(){
    this._destroy.next(true);
    this._destroy.unsubscribe();
  }
}
