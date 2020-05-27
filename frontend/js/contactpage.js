// For effects  
function openForm() {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("userInfo").style.display = "none";

  }

function closeForm() {
  document.getElementById("myForm").style.display = "none";
  document.getElementById("userInfo").style.display = "block";
  document.getElementById("addResult").innerHTML = "";
}
