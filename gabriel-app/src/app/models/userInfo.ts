export class UserInfoModel
{
	first_name: String;
	last_name: String;
	email: String;
	zipcode: String;
	password: String;
    createdAt: String;
	updatedAt: String;

	constructor(obj: any = null)
	{
		if(obj != null)
		{
			Object.assign(this, obj);
		}
	}
}
