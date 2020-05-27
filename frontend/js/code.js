//some nice variables for modularity
var urlBase = '//elevenbrethren.com/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doRegistration()
{
	//always gotta zero these out
	userId = 0;
	firstName = "";
	lastName = "";

	//grabbing some variables from user input
	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	var username = document.getElementById("username").value;
	var rPassword = document.getElementById("password").value;
	var rConfirm = document.getElementById("confirm").value;
	
	//clearing out the error display
	document.getElementById("result2").innerHTML = "";
	
	//verifying the "confirm password" field matches the "password" field
	if (rPassword != rConfirm)
	{
		document.getElementById("result2").innerHTML = "passwords do not match";
	}
	else
	{
		//constructing the payload
		var jsonPayload = '{"login" : "' + username + '", "password" : "' + rPassword + '", "firstName" : "' + firstName + '", "lastName" : "' + lastName + '"}';
		var url = urlBase + '/Register.' + extension;
		
		//creates a new connection to the database through the php file
		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, false);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			//creating an event listener for if the registration succeeds
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					document.getElementById("result2").innerHTML = "You are now signed up!";
				}
			}
			//logs the payload for debugging, then sends it
			console.log(jsonPayload);
			xhr.send(jsonPayload);
			
			//creates a login cookie and redirects to the contact page
			// saveCookie();
			// self.location = "contactpage.html";
		}
		catch(err)
		{
			document.getElementById("result2").innerHTML = err.message;
		}
	}
}

function doLogin()
{
	//always gotta zero these out
	userId = 0;
	firstName = "";
	lastName = "";

	//grabbing some variables from user input
	var username = document.getElementById("usernameLogin").value;
	var lPassword = document.getElementById("passwordLogin").value;
	
	//clearing out the error display
	document.getElementById("result1").innerHTML = "";

	//constructing the payload
	var jsonPayload = '{"login" : "' + username + '", "password" : "' + lPassword + '"}';
	var url = urlBase + '/Login.' + extension;

	//creates a new connection to the database through the php file
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		//sends the payload
		xhr.send(jsonPayload);
		
		//reads the server response, which includes information about the user
		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;
		
		//if the userId is less than one, the login did not succeed
		if( userId < 1 )
		{
			document.getElementById("result1").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;
		
		//saves the cookie and redirects to the contact page
		saveCookie();
		self.location = "contactpage.html";
	}
	catch(err)
	{
		document.getElementById("result1").innerHTML = err.message;
	}

}

//creates a cookie which includes date of access and the user account information
function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

//parses the cookie for user information
function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("result").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

// Logout 
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= , lastName =, userId = ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Add new contact
function addContact()
{
	var firstName = document.getElementById("fName").value;
	var lastName = document.getElementById("lName").value;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;

	console.log("fname, lastname, phone, email" + fName + " " + lastName + " " + phone + " " + email)

	document.getElementById("addResult").innerHTML = "";
		
	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "phone" : "' + phone + '", "email" : "' + email + '"}';
	console.log(jsonPayload)
	var url = urlBase + '/NewContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("addResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("addResult").innerHTML = err.message;
	}
	
}