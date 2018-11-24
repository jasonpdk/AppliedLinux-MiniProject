// Permissions calculators
function selectType() {
   var lettersHTML = "<select id=\"letterEntry1\" name=\"letterEntry1\"><option value=\"---\">---</option><option value=\"--x\">--x</option><option value=\"-w-\">-w-</option><option value=\"-wx\">-wx</option><option value=\"r--\">r--</option><option value=\"r-x\">r-x</option><option value=\"rw-\">rw-</option><option value=\"rwx\">rwx</option></select><select id=\"letterEntry2\" name=\"letterEntry2\"><option value=\"---\">---</option><option value=\"--x\">--x</option><option value=\"-w-\">-w-</option><option value=\"-wx\">-wx</option><option value=\"r--\">r--</option><option value=\"r-x\">r-x</option><option value=\"rw-\">rw-</option><option value=\"rwx\">rwx</option></select><select id=\"letterEntry3\" name=\"letterEntry3\"><option value=\"---\">---</option><option value=\"--x\">--x</option><option value=\"-w-\">-w-</option><option value=\"-wx\">-wx</option><option value=\"r--\">r--</option><option value=\"r-x\">r-x</option><option value=\"rw-\">rw-</option><option value=\"rwx\">rwx</option></select>";
   var numbersHTML = "<select id=\"numberEntry1\" name=\"numberEntry1\"><option value=\"0\">0</option><option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option><option value=\"4\">4</option><option value=\"5\">5</option><option value=\"6\">6</option><option value=\"7\">7</option></select><select id=\"numberEntry2\" name=\"numberEntry2\"><option value=\"0\">0</option><option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option><option value=\"4\">4</option><option value=\"5\">5</option><option value=\"6\">6</option><option value=\"7\">7</option></select><select id=\"numberEntry3\" name=\"numberEntry3\"><option value=\"0\">0</option><option value=\"1\">1</option><option value=\"2\">2</option><option value=\"3\">3</option><option value=\"4\">4</option><option value=\"5\">5</option><option value=\"6\">6</option><option value=\"7\">7</option></select>";

   if (document.getElementById("letters").checked == true) {
     document.getElementById("update").innerHTML = lettersHTML;
   } else if (document.getElementById("numbers").checked == true) {
     document.getElementById("update").innerHTML = numbersHTML;
   }
 }

function fillOptionHTML() {
  var html = "<label>Size in bytes:</label><input type=\"number\" id=\"size\" name=\"size\" min=\"1\" placeholder=\"Size in bytes\" /><br />";
  if (document.getElementById("fillOpt").checked == true) {
    document.getElementById("showHTML").innerHTML = html;
  } else {
    document.getElementById("showHTML").innerHTML = "";
  }
}
