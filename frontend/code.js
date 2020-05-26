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

	firstName = document.getElementById("firstName").value;
	lastName = document.getElementById("lastName").value;
	var username = document.getElementById("username").value;
	var rPassword = document.getElementById("password").value;
	var rConfirm = document.getElementById("confirm").value;

	if (rPassword != rConfirm)
	{
		document.getElementById("result").innerHTML = "passwords do not match";
	}
	else
	{
		var jsonPayload = '{"login" : "' + username + '", "password" : "' + rPassword + '", "firstName" : "' + firstName + '", "lastName" : "' + lastName + '"}';
		var url = urlBase + '/Register.' + extension;

		var xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function()
			{
				if (this.readyState == 4 && this.status == 200)
				{
					document.getElementById("result").innerHTML = "You are now signed up!";
				}
			}
			console.log(jsonPayload);
			xhr.send(jsonPayload);
			
			saveCookie();
			window.location.replace("https://elevenbrethren.com/contactpage.html");
		}
		catch(err)
		{
			document.getElementById("result").innerHTML = err.message;
		}
	}
}

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	console.log('Logging in...');

	var username = document.getElementById("usernameLogin").value;
	var lPassword = document.getElementById("passwordLogin").value;
//	var hash = md5( password );

	document.getElementById("result").innerHTML = "";

	var jsonPayload = '{"login" : "' + username + '", "password" : "' + lPassword + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;

		if( userId < 1 )
		{
			document.getElementById("result").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();

		window.location.replace("https://elevenbrethren.com/contactpage.html");
	}
	catch(err)
	{
		document.getElementById("result").innerHTML = err.message;
	}

}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= , lastName =, userId = ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}