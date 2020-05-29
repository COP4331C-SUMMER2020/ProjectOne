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
		
		console.log("userID: " + userId);
		
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
		self.location = "index.html";
	}
	else
	{
		//document.getElementById("result").innerHTML = "Logged in as " + firstName + " " + lastName;
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
	//readCookie();
	console.log("userID: " + userId);
	
	var firstName = document.getElementById("fName").value;
	var lastName = document.getElementById("lName").value;
	var fullName = firstName + " " + lastName;
	var phone = document.getElementById("phone").value;
	var email = document.getElementById("email").value;

	if(firstName === "" && lastName === "" && phone === "" && email === "")
	{
		document.getElementById("addResult").innerHTML = "Enter contact information for at least one field";
		return false; 
	}

	console.log("firstname, lastname, phone, email" + firstName + " " + lastName + " " + phone + " " + email)
		
	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "phoneNumber" : "' + phone + '", "email" : "' + email + '", "ID" : "' + userId + '"}';
	console.log(jsonPayload)

	var url = urlBase + '/NewContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("fName").value = "";
				document.getElementById("lName").value = "";
				document.getElementById("phone").value = "";
				document.getElementById("email").value = "";

				document.getElementById("addResult").innerHTML = "Contact has been added";

			}
		}

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("fName").value = "";
		document.getElementById("lName").value = "";
		document.getElementById("phone").value = "";
		document.getElementById("email").value = "";

		document.getElementById("addResult").innerHTML = err.message;
	}
	
}


// Search for contact
function searchContact()
{	
	var searchInput = document.getElementById("searchInput").value;
	var searchList = "";

	console.log(searchInput)

	if(searchInput == ""){
		document.getElementById("searchResult").innerHTML = "Please add information";
		return;
	}
	
	document.getElementById("searchResult").innerHTML = "";
	
	var jsonPayload = '{"fullName" : "' + searchInput + '", "ID" : "' + userId + '"}';
	console.log(jsonPayload)

	var url = urlBase + '/SearchContact.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("searchResult").innerHTML = "User(s) have been retrieved";

				var jsonObject = JSON.parse( xhr.responseText );

				if (jsonObject.error){
					document.getElementById("searchResult").innerHTML = "Contact not found";
					return false;
				}

				console.log("RETURNED JSON OBJECT FROM API")
				console.log(jsonObject);

				//Build table 
				var text = "";
				text += " <table> <tr class= \"header\">";

				text += "<th style=\"width:25%;\"> First Name</th>";
				text += "<th style=\"width:25%;\"> Last Name</th>";
				text += "<th style=\"width:30%;\"> Email</th>";
				text += "<th style=\"width:30%;\"> Phone</th>";
				text += "<th style=\"width:30%;\" colspan=\"2\"></th>";
				text += "</tr>";

				for( var i=0; i < jsonObject.results.length; i+=4)
				{
					//Make these global 
					var firstName = jsonObject.results[i];
					var lastName = jsonObject.results[i+1];
					var email = jsonObject.results[i+2];
					var phone = jsonObject.results[i+3];
					
					text += "<tr>";
					text += "<td>" + firstName + "</td>";
					text += "<td>" + lastName + "</td>";
					text += "<td>" + email + "</td>";
					text += "<td>" + phone + "</td>";
					text += "<td> <button class = \"searchButton\" onClick=\"editContact(firstName, lastName, email, phone)\"> Edit </button> </td>"
					text += "<td> <button class = \"searchButton\" onClick=\"deleteContact()\"> Delete </button> </td>"
					text += "</tr>"
				}

				text += "</table>"

				document.getElementById("myTable").innerHTML = text;
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("searchResult").innerHTML = err.message;
	}
	
}


function editContact(args1, args2, args3, args4) {
	document.getElementById("userInfo").style.display = "block";

	var firstName = args1; 
	var lastName = args2; 
	var email = args3; 
	var phone = args4; 

	//pass in variables 
	doEdit();

}

// function for the textbox
function doEdit(){
	//get user ID 

	document.getElementById("fNameEdit").style.display = fNameEdit;
	document.getElementById("lNameEdit").style.display = lNameEdit;
	document.getElementById("emailEdit").style.display = emailEdit;
	document.getElementById("phonEdit").style.display = phonEdit;

	//PHP Here
	var jsonPayload = '{"firstName" : "' + firstName + '", "lastName" : "' + lastName + '", "phoneNumber" : "' + phone + '", "email" : "' + email + '", "ID" : "' + userId + '"}';
	console.log(jsonPayload)

	var url = urlBase + '/NewContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("fName").value = "";
				document.getElementById("lName").value = "";
				document.getElementById("phone").value = "";
				document.getElementById("email").value = "";

				document.getElementById("addResult").innerHTML = "Contact has been added";

			}
		}

		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("fName").value = "";
		document.getElementById("lName").value = "";
		document.getElementById("phone").value = "";
		document.getElementById("email").value = "";

		document.getElementById("addResult").innerHTML = err.message;
	}
	
	// END PHP

	document.getElementById("userInfo").style.display = "none";
}

function deleteContact() {
	console.log("delete contact button is working");
}


// Effects 
function openForm() {
	document.getElementById("myForm").style.display = "block";
}

function closeForm(){
	document.getElementById("myForm").style.display = "none";
}