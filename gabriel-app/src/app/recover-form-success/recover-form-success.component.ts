import { Component, OnInit } from '@angular/core';
import {emailInfoModel} from '../models/emailinfo'
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'recover-form-success',
  templateUrl: './recover-form-success.component.html',
  styleUrls: ['./recover-form-success.component.css']
})
export class RecoverFormSuccessComponent implements OnInit {

 data: emailInfoModel = new emailInfoModel({email: "email@email.com" });

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

	 private subscriber: any;

  ngOnInit() {
	  
	 
	    	this.subscriber = this.route.params.subscribe(params => {
	       	   
	       this.http.get('/api/v1/email/' + params.id).subscribe((data:any) => {
				
				
						console.log(data);	
				this.data = new emailInfoModel(data);
		    });
	    });
	  
  }

}
