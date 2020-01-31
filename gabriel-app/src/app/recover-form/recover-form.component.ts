import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";


@Component({
  selector: 'recover-form',
  templateUrl: './recover-form.component.html',
  styleUrls: ['./recover-form.component.css']
})
export class RecoverFormComponent implements OnInit {

	registered = false;
	submitted = false;
	recoverForm: FormGroup;
	service_errors:any = {};

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router)
  { }

  ngOnInit() {
	  
	    this.recoverForm = this.formBuilder.group({
  		email: ['', Validators.required]
  	});
	  
  }
  
    invalidEmail()
  {
  	return (this.submitted && (this.service_errors.email != null || this.recoverForm.controls.email.errors != null));
  }

  onSubmit_recover()
  {
  	this.submitted = true;

  	if(this.recoverForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{		

		let data: any = Object.assign(this.recoverForm.value);
	
		this.http.post('/api/v1/service/email', data).subscribe((data:any) => {
	      
		  //if exists contiues
	  
			let data1:any =Object.assign({email: this.recoverForm.value.email , message: "Sucess: Email is not sent yet",tobesent: "true", sent: "false"});
			
			this.http.post('/api/v1/email', data1).subscribe((data1:any) => {
			
				
			let path = '/sent/'+data1._id;
			this.router.navigate([path]);
				console.log("forwarding time");
			}, error =>
			{
				console.log(error.error.message);
	    	this.service_errors = error.error.message;
			});
					  
			
	    }, error =>
	    {
	    	
			let data1:any =Object.assign({email: this.recoverForm.value.email, message: "Error :email not registered yet",tobesent:"false", sent: "false"});
			
			
			this.http.post('/api/v1/email', data1).subscribe((data1:any) => {
				
				console.log(data1[0]);		
			}, error =>
			{
	    	this.service_errors = error.error.message;
			});
			
			
			this.service_errors = error.error.message;
						
        });
	
  		this.registered = true;
  	}
  }


}
