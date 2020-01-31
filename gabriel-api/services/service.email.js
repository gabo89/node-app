
const Validator = require('fastest-validator');
const Email = require('../models/model.email.js');




/* create an instance of the validator */
let EmailValidator = new Validator();


/* customer validator shema */
const emailVSchema = {
		email: { type: "email", max: 75 }
	};

/* static customer service class */

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

exports.create = (req, res) => {
	
		// Validate request
    	var vres = EmailValidator.validate(req.body, emailVSchema);
		
		/* validation failed */
		if(!(vres === true))
		{
			let errors = {}, item;

			for(const index in vres)
			{
				item = vres[index];

				errors[item.field] = item.message;
			}
			
			return res.status(500).send({
			    message: errors
			});
		}
	  
		const email = new Email(req.body);

		Email.find({ email: req.body.email})
		.then(data => {
			
			console.log('found data with given email  service.email create:',data);
			
			if(isEmpty(data)) {
						
				console.log('created sent_email_task')
				email.save().then(data => {
				res.send(data);
				}).catch(err => {
				res.status(500).send({
					message: err.message 
				});
			});         
			}
			else
			{
				console.log('not created sent_email_task')
				let errors = {email:"Email task is already registered!." };
				return res.status(500).send({
			    message:errors
				});
			
			}
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "customer not found with username " + email
				});                
			}
			return res.status(500).send({
				message: "Error retrieving customer with username " + email
			});
		});



}

exports.retrieveall = (req, res) => {
   	  Email.find().then(data => {
			res.send(data);
		}).catch(err => {
			res.status(500).send({
				message: err.message 
			});
		});	
};

exports.retrieveone = (req, res) => {
	

   Email.find({ email: req.params.email})
		.then(data => {
			if(isEmpty(data)) {
				return res.status(404).send({
					message: "Email not found with name " + email
				});            
			}
			res.send(data);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "Email not found with name " + email
				});                
			}
			return res.status(500).send({
				message: "Error retrieving Email name " + email
			});
		});
};


exports.retrieveone_byid = (req, res) => {
	

   Email.findById(req.params.id)
		.then(data => {
			if(isEmpty(data)) {
				
				let errors = {email:"Email not found with id " + req.params.id };
				
				return res.status(404).send({
					message: errors
				});            
			}
			res.send(data);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				
				let errors = {email:"Email not found with id " + req.params.id };
				
				return res.status(404).send({
					message: errors
				});                
			}
			errors = {email:"Error retrieving Email with id " + req.params.id };
			
			return res.status(500).send({
				message: errors
			});
		});
};




