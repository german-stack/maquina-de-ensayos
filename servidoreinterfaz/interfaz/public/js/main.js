const socket = io();


var options={
	
	legend:{
		
		labels:{
			padding: 10,
			
			fontFamily: 'system-ui',
			fontColor:'white'
			
		}
		},
	
	elements:{
		line:{
			borderWidth: 3,
			fill: false,
			
			
		}
		
	},
	
	
	scales: {
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 160
                }
            }],
			
			xAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 160
                }
            }]
        }
    };
	
var ctx = document.getElementById('myChart1').getContext('2d');

var chart = new Chart(ctx, {
    type: 'scatter',
    data: {
        datasets: [{
            label: 'FUERVA VS  POSICIÓN',
			borderColor:"red",
            data: []
        }],
       
    },
    options: options
});




var off=0;
function suiches(value)//movimiento maquina
	{
	var pic;
	var pic2;
	var pic3;
	var pic4;
	
	
		if(value == 1) 
		{
			pic="img/onmotor .png";
			
			document.getElementById('hidra1').src=pic;//a
			socket.emit('mover', 'a');
			
		    
		}
		if(value == 0)
		{
			pic="img/offmotor.png";
			
			document.getElementById('hidra1').src=pic; //cambia la imagen  //h
			socket.emit('mover', 'b');
			
		}
		
		
		if(value == 2)//subir
		{	
			pic2="img/subiron.png";
			pic3="img/bajaroff.png";
			pic4="img/pausaoff.png"
			document.getElementById('subir').src=pic2;
			document.getElementById('pausa').src=pic4;
			document.getElementById('bajar').src=pic3;
			if(off==1){socket.emit('mover', 'c');}
			if(off==0){socket.emit('mover', 'g');}
			
			
		}
		
		if(value == 3)
		{	
			pic2="img/subiroff.png";
			pic3="img/bajaroff.png";
			pic4="img/pausaon.png"
			document.getElementById('subir').src=pic2;
			document.getElementById('pausa').src=pic4;
			document.getElementById('bajar').src=pic3;
			socket.emit('mover', 'e');
			
		}
		if(value == 4)
		{	
			pic2="img/subiroff.png";
			pic3="img/bajaron.png";
			pic4="img/pausaoff.png"
			document.getElementById('subir').src=pic2;
			document.getElementById('pausa').src=pic4;
			document.getElementById('bajar').src=pic3;
			if(off==1){socket.emit('mover', 'd');}
			if(off==0){socket.emit('mover', 'f');}
		}
		
		if(value == 5 && off ==0)
		{	value=4;
	        off=1;
			
			document.getElementById('lateral').src="img/lateralon.png"; 
			
          
		}
		
		if(value == 5 && off==1)
		{	
			off=0;
			console.log(off);
			document.getElementById('lateral').src="img/lateraloff.png"; 
			
          
		}
		
}
	

function velocidad() //envia  nuevo setpoint al arduino
{ var x = document.getElementById("velocidad").value;
  socket.emit('mover', 'j'+x);
			
}
		



		
		
function myFunction() {
    var x = document.getElementById("pid");
	var e = document.getElementById("medida");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
		
    }
	
	 if (e.style.display === "block") {
        e.style.display = "none";
    }
	
	
}

function myFunction2() {
    var x = document.getElementById("medida");
	var e = document.getElementById("pid");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
	
	if (e.style.display === "block") {
        e.style.display = "none";
    }
	
}

function myFunction3() {
    var x = document.getElementById("textrectangular");
	var e = document.getElementById("textcilindrica");
	var z = document.getElementById("Area");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
	
	
	if (e.style.display === "block") {
        e.style.display = "none";
    }
	
	if (z.style.display === "block") {
        z.style.display = "none";
    }
	
	
}

function myFunction4() {
    var x = document.getElementById("textcilindrica");
	 var e = document.getElementById("textrectangular");
	 var z = document.getElementById("Area");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
	
	
	if (e.style.display === "block") {
        e.style.display = "none";
    }
	
	if (z.style.display === "block") {
        z.style.display = "none";
    }
	
	
}

function myFunction5() {
    var x = document.getElementById("Area");
	var z= document.getElementById("textcilindrica");
	var e = document.getElementById("textrectangular");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
	
	if (e.style.display === "block") {
        e.style.display = "none";
    }
	
	if (z.style.display === "block") {
        z.style.display = "none";
    }
	
}


function addData(dota) {
   
   chart.data.datasets[0].data=dota;
  
  
    chart.update();
}

function exportTableToCSV() {
    var csv = [];
	var file=prompt("Ingrese el nombre del archivo ");
	var exten=".csv";
	var filename = file.concat(exten);
	console.log(filename);
    var rows = document.querySelectorAll("table tr");
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}	

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function generar_tabla2(datos3){
    
    let myTable= "<table><tr><td style='width: 100px; color: red;'>Fuerza</td>";
	myTable+="<td style='width: 100px; color: red; text-align: right;'>Alargamiento</td></tr>";
    myTable+="<tr><td style='width: 100px;'>---------------</td>";
	myTable+="<td style='width: 100px; text-align: right;'>---------------</td></tr>";    

    for (let i = 0; i < datos3.length; i++) {
		myTable+="<tr><td style='width: 100px;color: red; text-align: right;'>" + datos3[i].y+ "</td>";        
		myTable+="<td style='width: 100px;color: red; text-align: right;'>" + datos3[i].x + "</td>";    
		myTable+="</tr>";
    }
      
    myTable+="</table>";
    document.getElementById('tablePrint').innerHTML = myTable;
  }
   
function removeData(datos3) {
   
for (let i = datos3.length; i > 0; i--) {
  datos3.pop();
}
 addData(datos3);   

}



 


var fuerzaMaxima=0;
datos3 = new Array();

socket.on('arduino',function(data) //recibe los datos y los carga en la interfaz

{
		
	datos3.push({x:data[1],y:data[0]});
	
	
	 addData(datos3);
	 generar_tabla2(datos3);
	
        var demo = document.getElementById('demo');//muestra la posicion
        demo.innerHTML ='Posicion:'+data[1]+'mm';
		var demo1 = document.getElementById('demo1');
        demo1.innerHTML ='Fuerza:'+data[0]+'KN';
		
       
		 
		if(data[0]>fuerzaMaxima){fuerzaMaxima=data[0];
		 var demo4 = document.getElementById('demo4');
		 demo4.innerHTML ='Fuerza maxima:'+alargamientos+'KN';	
		}
         
	    var demo5 = document.getElementById('demo5');
        demo5.innerHTML ='Velocidad Actual:'+data[2]+'KN/S';
	

	
	}
	
	);
        




        
       

var area3 =0;
var lado1=0;
var lado2=0;
var altura =0;

function calculararea(dato) //a
{  
   if (dato==1) //area seccion circular
   {

	var x = document.getElementById("diametro").value;
	area3=  Math.PI * Math.pow((x/2),2);
	console.log(Math.PI * Math.pow((x/2),2));
    var demo2 = document.getElementById('demo2');
    demo2.innerHTML ='Area: '+area3+'mm&sup2';
	
}
 if (dato==2) //longitud
 
 {

	var z = document.getElementById("longitud").value;
	altura=z;
    var demo3 = document.getElementById('demo3');
    demo3.innerHTML ='Longitud:'+altura+'mm';	
}

 if (dato==3){

	var x = document.getElementById("lado1").value;
	lado1=x;
	area= lado1*lado2;
    var demo2 = document.getElementById('demo2');
    demo2.innerHTML ='Area:'+x+'mm&sup2';
	
}

 if (dato==4){

	var x = document.getElementById("lado2").value;
	lado2=x;
	area=lado1*lado2;
    var demo2 = document.getElementById('demo2');
    demo2.innerHTML ='Area:'+x+'mm&sup2';
	
}
if (dato==5){

	var x = document.getElementById("area1").value;
	area3=x;
    var demo2 = document.getElementById('demo2');
    demo2.innerHTML ='Area:'+area3+'mm&sup2';
	
}



   

if (dato==6){

	var x = document.getElementById("area1").value;
	area=x;
    var demo2 = document.getElementById('demo2');
    demo2.innerHTML ='Area:'+x+'mm&sup2';
	
}


 
			
}


















