var urlBase = 'http://elevenbrethren.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doRegistration()
{
	userId = 0;
	firstName = "";
	lastName = "";

console.log('Registering...');

	var regLogin = document.getElementById("regLogin").value;
	var regFirstName = document.getElementById("regFirstName").value;
	var regLastName = document.getElementById("regLastName").value;
	var regPassword = document.getElementById("regPass").value;
	var regConfirm = document.getElementById("regConfirm").value;

	if (regPassword != regConfirm)
	{
		document.getElementById("registerResult").innerHTML = "passwords do not match";
	}
	else
	{
		var jsonPayload = '{"login" : "' + regLogin + '", "password" : "' + regPassword + '", "firstName" : "' + regFirstName
		+ '", "lastName" : "' + regLastName + '"}';
		var url = urlBase + '/Register.' + extension;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.send(jsonPayload);

			var jsonObject = JSON.parse( xhr.responseText );

			userId = jsonObject.id;
		}
		catch(err)
		{
			document.getElementById("loginResult").innerHTML = err.message;
		}
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	console.log('Logging in...');

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		//saveCookie();

		window.location.href = "contactpage.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
