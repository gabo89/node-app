
const Validator = require('fastest-validator');
const Customer = require('../models/model.customer.js');




/* create an instance of the validator */
let customerValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;
let zipCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

/* customer validator shema */
const customerVSchema = {
		first_name: { type: "string", min: 4, max: 50, pattern: namePattern},
		last_name: { type: "string", min: 4, max: 50, pattern: namePattern},
		email: { type: "email", max: 75 },
		zipcode: { type: "string", max: 5, pattern: zipCodePattern},
		password: { type: "string", min: 2, max: 50, pattern: passwordPattern}
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
    	var vres = customerValidator.validate(req.body, customerVSchema);
		
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
	  
	  
		const customer = new Customer(req.body);

		Customer.find({ email: req.body.email,password: req.body.password})
		.then(data => {
			
			console.log('found data with given email and username service.customer create:',data);
			
			if(isEmpty(data)) {
						
				console.log('created username')
				customer.save().then(data => {
					res.send(data);
				}).catch(err => {
					res.status(500).send({
					message: err.message 
					});
				});            
			}
			else
			{
				console.log('not created username')
				let errors = {email:"Email is already registered!." };
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
   	  Customer.find().then(data => {
			res.send(data);
		}).catch(err => {
			res.status(500).send({
				message: err.message 
			});
		});	
};

exports.retrieveone_byid = (req, res) => {
	

   Customer.findById(req.params.id)
		.then(data => {
			if(isEmpty(data)) {
				
				let errors = {email:"customer not found with id " + req.params.id };
				
				return res.status(404).send({
					message: errors
				});            
			}
			res.send(data);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				
				let errors = {email:"customer not found with id " + req.params.id };
				
				return res.status(404).send({
					message: errors
				});                
			}
			errors = {email:"Error retrieving customer with id " + req.params.id };
			
			return res.status(500).send({
				message: errors
			});
		});
};

exports.retrieveone_by_email_password = (req, res) => {
	

   Customer.find({ email: req.body.username,password: req.body.password})
		.then(data => {
			if(isEmpty(data)) {
				
				let errors = { password:" Wrong password , ¿do you remenber your password?."};
				return res.status(404).send({
					message: errors
				});            
			}
			
			res.send(data);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "customer not found with guid " + username
				});                
			}
			return res.status(500).send({
				message: "Error retrieving customer with guid " + username
			});
		});
};


exports.retrieveone_by_email = (req, res) => {
	

   Customer.find({ email: req.body.email})
		.then(data => {
			if(isEmpty(data)) {
				
				let errors = { email:" Email is not registered!."};
				return res.status(404).send({
					message: errors
				});            
			}
			
			res.send(data);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "customer not found with Email " + email
				});                
			}
			return res.status(500).send({
				message: "Error retrieving customer with Email " + email
			});
		});
};

exports.updateone = (req, res) => {
	
		var vres = customerValidator.validate(req.body, customerVSchema);
		
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
		
		Customer.findByIdAndUpdate(req.params.id, req.body, {new: true})
		.then(data => {
			if(isEmpty(data)) {
				return res.status(404).send({
					message: "customer not found with id " + req.params.id
				});
			}
			res.send(data);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "customer not found with id " + req.params.id
				});                
			}
			return res.status(500).send({
				message: "Error updating customer with id " + req.params.id
			});
		});
	
};


exports.deleteone = (req, res) => {
		Customer.findByIdAndRemove( req.params.id)
			.then(data => {
				if(isEmpty(data)) {
					return res.status(404).send({
						message: "customer not found with id " + req.params.id
					});
				}
				res.send({message: "customer deleted successfully!"});
			}).catch(err => {
				if(err.kind === 'ObjectId' || err.name === 'NotFound') {
					return res.status(404).send({
						message: "customer not found with id " + req.params.id
					});                
				}
				return res.status(500).send({
					message: "Could not delete customer with id " + req.params.id
				});
			});
	
};


