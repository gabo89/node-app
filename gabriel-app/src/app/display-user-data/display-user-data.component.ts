import { Component, OnInit } from '@angular/core';
import {UserInfoModel} from '../models/userInfo'
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router";

@Component({
  selector: 'app-display-user-data',
  templateUrl: './display-user-data.component.html',
  styleUrls: ['./display-user-data.component.css']
})
export class DisplayUserDataComponent implements OnInit {

  user: UserInfoModel = new UserInfoModel({first_name: "aaaa", 
		last_name: "bbbb", 
		email: "email@email.com", 
		zipcode: 54321,
		password: "xxxxxxx"});

   private subscriber: any;
   private ownid:any ;
   
     registered = false;
	submitted = false;
	dataForm: FormGroup;
	
	service_errors:any = {};
   

 constructor(private formBuilder: FormBuilder,private http: HttpClient, private route: ActivatedRoute, private router: Router) {

	}
	
	  invalidFirstName()
  {
  	return (this.submitted && (this.service_errors.first_name != null || this.dataForm.controls.first_name.errors != null));
  }

  invalidLastName()
  {
  	return (this.submitted && (this.service_errors.last_name != null || this.dataForm.controls.last_name.errors != null));
  }

  invalidEmail()
  {
  	return (this.submitted && (this.service_errors.email != null || this.dataForm.controls.email.errors != null));
  }

  invalidZipcode()
  {
  	return (this.submitted && (this.service_errors.zipcode != null || this.dataForm.controls.zipcode.errors != null));
  }

  invalidPassword()
  {
  	return (this.submitted && (this.service_errors.password != null || this.dataForm.controls.password.errors != null));
  }
	

  ngOnInit() {
	  
	 	  
		  
	  	this.subscriber = this.route.params.subscribe(params => {

			  this.ownid= Object.assign(params.id);

		   
	       this.http.get('/api/v1/customer/' + params.id).subscribe((data:any) => {
				
				
						
				this.dataForm.get('first_name').setValue(data.first_name);
				this.dataForm.get('last_name').setValue(data.last_name);
				this.dataForm.get('email').setValue(data.email);
				this.dataForm.get('zipcode').setValue(data.zipcode);
				this.dataForm.get('password').setValue(data.password);
		    });
	    });
		
		
		
	  
	   this.dataForm = this.formBuilder.group({
  		first_name: ['', Validators.required],
  		last_name: ['', Validators.required],
  		email: ['', [Validators.required, Validators.email]],
  		zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
  		password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
		});
		
  }
  
      onSubmit_change()
  {
  	this.submitted = true;

  	if(this.dataForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{
		
		let data: any = Object.assign(this.dataForm.value);

  		this.http.put('/api/v1/customer/'+this.ownid, data).subscribe((data:any) => {
	      

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
