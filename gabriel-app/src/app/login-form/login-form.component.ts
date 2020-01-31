import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service"
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

	registered = false;
	submitted = false;
    cookieValue = 'UNKNOWN';
	cookieTime ='UNKNOWN';
	loginForm: FormGroup;
	service_errors:any = {};
	private subscriber: any;
	
  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router , private cookieService: CookieService , private route: ActivatedRoute,  )
  {}

  ngOnInit() {
	  
	    this.loginForm = this.formBuilder.group({
  		username: ['', Validators.required],
  		password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
		selection: ['true']
  	});
	
	console.log(this.loginForm.value);
	
	var secondtime = new Date();
	
	if (this.cookieService.check('id'))
    this.cookieValue = this.cookieService.get('id');

    if (this.cookieService.check('time'))
	{
		this.cookieTime = this.cookieService.get('time');	
		var firsttime= new Date(this.cookieTime);	
		var timeDiff = Math.abs(secondtime.getTime() - firsttime.getTime());	
		console.log("entered cookie service: "+timeDiff);
		
		if (timeDiff < 18000)
		{
			
			
			 this.subscriber = this.route.params.subscribe(params => {		   
				this.http.get('/api/v1/customer/' + this.cookieValue).subscribe((data:any) => {
					
				//let path = '/index';
				//this.router.navigate([path]);
				//console.log("reroute to cookie");
				
		    }, error =>
			{
				
				this.service_errors = error.error.message;
				console.log("error : "+ this.service_errors.email)
			});
	    });
			
			
		}
		else
		{
			this.service_errors.email="Session Timeout";
			this.cookieService.deleteAll();
			console.log("delete all cookie");
		}
	
	}
	
	
	  
  }
  
  invalidloginpassword()
  {
  	return (this.submitted && (this.service_errors.password != null ||this.loginForm.controls.password.errors != null));
  }

  invalidsession()
  {
  	return (this.submitted && this.service_errors.email != null );
  }

  
  invalidUsername()
  {
  	return (this.submitted && (this.service_errors.username != null ||this.loginForm.controls.username.errors != null));
  }
  
    onSubmit_login()
  {
  	this.submitted = true;
	console.log(this.loginForm.value);

  	if(this.loginForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{		

		let data: any = Object.assign(this.loginForm.value);
	
		this.http.post('/api/v1/service/login', data).subscribe((data:any) => {
	      
		  //if exists contiues
			let iduser=data[0]._id;
			var time =new Date().toISOString();
			
			let data1:any =Object.assign({username: this.loginForm.value.username, password: this.loginForm.value.password , message: "Success Authentication"});
			console.log(data1);
			this.http.post('/api/v1/login', data1).subscribe((data1:any) => {
				
			let path = '/index';
			this.router.navigate([path]);
			
			if (this.loginForm.value.selection)
			{
			this.cookieService.set( 'id', iduser );
			this.cookieService.set( 'time', time );
			}
			
			console.log("forwarding time");
			}, error =>
			{
				console.log(error.error.message);
	    	this.service_errors = error.error.message;
			});
					  
			
	    }, error =>
	    {
	    	
			let data1:any =Object.assign({username: this.loginForm.value.username, password: this.loginForm.value.password , message: "Error Authentication"});
			console.log(data1);
			
			this.http.post('/api/v1/login', data1).subscribe((data1:any) => {
				
			
				
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
