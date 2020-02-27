import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiServiceService } from './../api-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employeeForm;
  employees;
  departments;
  employee;
  designations;
  formtype = 'add';
  url = 'add-employee';

  constructor(private formBuilder: FormBuilder,private apiService: ApiServiceService, private toastr: ToastrService) {
    this.employeeForm = this.formBuilder.group({
      fname: '',
      lname: '',
      department: '',
      designation: '',
      email: '',
      txtphone: '',
      password: '',
     
    });

   }

  ngOnInit() {
    this.employeetList();
    this.departmentList();
    this.designationList();
  }

  employeetList(){
    this.apiService.getDataAuth("employees")
    .subscribe(
      (res: any) => {
          if(res.status == 200){
            this.employees = res.data;
          }
        },
        error => {
          console.error("error creating");
        }
    );
  }

  departmentList(){
    this.apiService.getDataAuth("departments")
    .subscribe(
      (res: any) => {
          if(res.status == 200){
            this.departments = res.data;
          }
        },
        error => {
          console.error("error creating");
        }
    );
  }

  designationList(){
    this.apiService.getDataAuth("designation")
    .subscribe(
      (res: any) => {
          if(res.status == 200){
            this.designations = res.data;
          }
        },
        error => {
          console.error("error creating");
        }
    );
  }

  onSubmit(customerData) {
    var data = {fname: customerData.fname ,
      user_id: '',
      lname: customerData.lname,
       department: customerData.department,
       designation: customerData.designation,
       email: customerData.email,
       phone_no: customerData.txtphone,
       password: customerData.password};

    if(this.formtype == 'update'){
       data = {fname: customerData.fname,
        user_id: this.employee.id,
        lname: customerData.lname,
        department: customerData.department,
        designation: customerData.designation,
        email: customerData.email,
        phone_no: customerData.txtphone,
        password: customerData.password};
   }

    this.apiService.postDataAuth(this.url, data)
    .subscribe(
      (res: any) => {
          this.employeetList();

          this.formtype = 'add';
          this.url = 'add-employee';
          document.getElementById("close").click();
          this.toastr.success( 'User created successfully.', 'Success');
         
        },
        error => {
          console.error("error creating");
        }
    );
    console.warn('User created', customerData);
    this.employeeForm.reset();
  }

  editEmployee(employeeid){
    console.log('eee', employeeid);
    
    this.employee =  this.employees.find(o => o.id ==employeeid);
    console.log(this.employee);
    
    this.employeeForm.setValue({
      fname: this.employee.fname,
      lname: this.employee.lname,
      department: this.employee.department,
      designation: this.employee.designation_id,
      email: this.employee.email,
      txtphone: this.employee.phone_no,
      password: '12345678'
    })
    document.getElementById("openModel").click();
    this.formtype = 'update';
    this.url = 'edit-employee';
  }

  deleteEmployee(departmentid){
    var data = { user_id:departmentid};
   
    this.apiService.postDataAuth('delete-employee', data)
    .subscribe(
      (res: any) => {
          this.employeetList();
         
          this.toastr.success( 'user deleted successfully.', 'Success');
        },
        error => {
          console.error("error creating");
        }
    );
    
  }

}
