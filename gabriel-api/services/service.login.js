
const Validator = require('fastest-validator');
const Login = require('../models/model.login.js');




/* create an instance of the validator */
let loginValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

/* customer validator shema */
const loginVSchema = {
		username: { type: "email", max: 75 },
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
    	var vres = loginValidator.validate(req.body, loginVSchema);
		
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
	  
		const login = new Login(req.body);

		login.save().then(data => {
			res.send(data);
		}).catch(err => {
			res.status(500).send({
				message: err.message 
			});
		});

}

exports.retrieveall = (req, res) => {
   	  Login.find().then(data => {
			res.send(data);
		}).catch(err => {
			res.status(500).send({
				message: err.message 
			});
		});	
};

exports.retrieveone = (req, res) => {
	

   Login.find({ username: req.params.username})
		.then(data => {
			if(isEmpty(data)) {
				return res.status(404).send({
					message: "login not found with name " + username
				});            
			}
			res.send(data);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "login not found with name " + username
				});                
			}
			return res.status(500).send({
				message: "Error retrieving login name " + username
			});
		});
};

exports.updateone = (req, res) => {
	
		var vres = loginValidator.validate(req.body, loginVSchema);
		
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
		
		Login.findOneAndUpdate({ username: req.params.username}, req.body, {new: true})
		.then(data => {
			if(isEmpty(data)) {
				return res.status(404).send({
					message: "login not found with name " + username
				});
			}
			res.send(data);
		}).catch(err => {
			if(err.kind === 'ObjectId') {
				return res.status(404).send({
					message: "login not found with name " + username
				});                
			}
			return res.status(500).send({
				message: "Error retrieving login name " + username
			});
		});
	
};


exports.deleteone = (req, res) => {
		Login.findOneAndDelete({ username: req.params.username})
			.then(data => {
				if(isEmpty(data)) {
					return res.status(404).send({
						message: "login not found with name " + username
					});
				}
				res.send({message: "login deleted successfully!"});
			}).catch(err => {
				if(err.kind === 'ObjectId' || err.name === 'NotFound') {
					return res.status(404).send({
						message: "login not found with name" + username
					});                
				}
				return res.status(500).send({
					message: "Could not delete login with name " + username
				});
			});
	
};


