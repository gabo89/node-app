import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";


@Component({
  selector: 'input-user-data-form',
  templateUrl: './input-user-data-form.component.html',
  styleUrls: ['./input-user-data-form.component.css']
})
export class InputUserDataFormComponent implements OnInit {

    registered = false;
	submitted = false;
	userForm: FormGroup;
	service_errors:any = {};
	
    constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router)
  {
	  
  }

  invalidFirstName()
  {
  	return (this.submitted && (this.service_errors.first_name != null || this.userForm.controls.first_name.errors != null));
  }

  invalidLastName()
  {
  	return (this.submitted && (this.service_errors.last_name != null || this.userForm.controls.last_name.errors != null));
  }

  invalidEmail()
  {
  	return (this.submitted && (this.service_errors.email != null || this.userForm.controls.email.errors != null));
  }

  invalidZipcode()
  {
  	return (this.submitted && (this.service_errors.zipcode != null || this.userForm.controls.zipcode.errors != null));
  }

  invalidPassword()
  {
  	return (this.submitted && (this.service_errors.password != null || this.userForm.controls.password.errors != null));
  }


  ngOnInit() {
	  
	  this.userForm = this.formBuilder.group({
  		first_name: ['', Validators.required],
  		last_name: ['', Validators.required],
  		email: ['', [Validators.required, Validators.email]],
  		zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
  		password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
  	});
	  
  }

    onSubmit()
  {
  	this.submitted = true;

  	if(this.userForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{
		
		let data: any = Object.assign(this.userForm.value);

  		this.http.post('/api/v1/customer', data).subscribe((data:any) => {
	      

	      let path = '/user/' + data._id;

	      this.router.navigate([path]);
	    }, error =>
	    {
			
	    	this.service_errors = error.error.message;
        });
		
  		this.registered = true;
  	}
  }

}
