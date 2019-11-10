htmlDivs();//call the function to build both the divs


var global_var = [];
//This is the main ajax which loads data.json
    $.ajax({
               dataType: "json",
               url: 'https://raw.githack.com/ReneRanzinger/GlyGen-Advance-Search-widget/master/src/data.json',
               async:false,
               success: processData

           });

    function processData(data) {
      //console.log(data);
       var collection = {};
       var record;
       global_var = data;

  }//this is end of ajax
//console.log(global_var);
//saving values from the ajax into the var below
var nodes = global_var.nodes; //stores the data of nodes
var links = global_var.links;//stores the data of the links
var edges = [];

links.forEach(function(e) { 
    // Get the source and target nodes
    var linkName = e.linkName;
    var sourceNode = nodes.filter(function(n) { return n.id === e.source; })[0],
        targetNode = nodes.filter(function(n) { return n.id === e.target; })[0];
    

    // Add the edge to the array
    edges.push({source: sourceNode, target: targetNode,linkName :linkName,group : e.group});
});





//initializing the values so that it can be changed in future of needed

        var radius = 15;
        var width = window.innerWidth,
        height = window.innerHeight,
        nodeWidth = 140  //width of node
        nodeHeight = 35; //height of node
        node2Width = 50;
        node2Heigth = (nodeHeight/2);
        var originalState = $("#contents").html();


//setting basic d3 properties
        var force = d3.forceSimulation()
        .force("charge", d3.forceManyBody().strength(-5))
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(200))
        .nodes(nodes);

//appending on the div and rendering the graph on it
        var svg = d3.select("#mapSVG")
        init();//.append("svg")
       
       
        //Links
//this builds the links
      var link = svg.selectAll(".link")
            .data(edges)
            .enter()
            .append("g")
            .attr("class", "link")
            .append("polyline")
            //.attr("marker-start", "url(#start)")
            .attr("marker-mid", "url(#end)")
            .style("stroke", linkcolor)
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });
//appending Name of the Links on them
      var linkText = svg.selectAll(".link")
             .data(edges)
             .append("text")
             .attr("class", "link")

             .style("font-size", "13px")
             .style("fill","#000")
             .attr("dy", "1.8em")
             .attr("text-anchor", "middle")
             .text(function(d) {
                  return d.linkName;
               });


//appending the regular nodes
      var node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .on("dblclick", dblclick)
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })
        //highlghts the node and iterates the list to append the accession
        .on("click", function(d){
        d3.selectAll(".node")
        .style("stroke-width", "0px")
        d3.select(this).select("rect")
        .style("stroke-width", stkwidth)
       
        $("#contents").html(originalState);
        $("#contents").load('form');
        var createdForm = d.list;
        var schema = createdForm.schema;
        console.log(createdForm);
        $('form').jsonForm({
            schema, onSubmit: function(error,values){
              if(values){
               formSubmit(values);

              }
            },formSubmit  //formSubmit Function is called  
        
        });
       
        //
       
      
    
        //storing the length of the accession list
        /* var data1=d.name+"<br>";     //storing all the accession list in data1
        for(i=0 ; i<length; i++){
        //document.getElementById("contents").innerHTML = d.list[i].accession;
        
        data1=data1+ "  " +d.list[i].accession +"<br>";
        document.getElementById("display").innerHTML = data1;
        }*/

  });
//appending the node
      node.append("rect")
        .attr("class", "node")
        .attr("width", nodeWidth)
        .attr("height", nodeHeight)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", function(d) { return (d.nodecol); })
        //.style("fill",linkcolor)
      /*  .style("fill", function(d) {
            return color(d.group);
        })*/
        .style("stroke", "#ffff4d")
        .style("stroke-width", "0px");

//appending text on the main nodes
      node.append("text")
        .text(function(d) {
            return d.name;
        })
        .style("fill", "#fff")
        .style("font-size", "13px")
        .attr("x", (nodeWidth/2))
        .attr("y",(nodeHeight/2))
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        node.append("title")
            .text(function(d) {
            return d.name;
        });

//the code for the numeric nodes

        function showInput() {
          var value = document.getElementById("user_input").value; //Displays the value that is searched
          var result = "result_type";                              //To send the data according to the input of the webservice
          var json = JSON.stringify({result_type:value});          //Saving in json format
          console.log(json);
//Calling the webservice and getting data from post method
          var settings = {
            "url": "http://127.0.0.1:5000/commonSearch",
            "method": "POST",
            "headers": {
              "Content-Type": "application/json"
            },
            "data": json
          }
        console.log("hello")
          $.ajax(settings).done(function (response) {
        console.log(response);




          var values  = response.values;// saving the data in var values
          console.log(values);
        var numnodes = svg.selectAll(".numnodes")
        .data(nodes)
        .enter()
        .append("g")
        //.on("mouseover", mouseover)
        //.on("mouseout",mouseout)
        .attr("transform", function(d) {
            return "translate(" + ((d.x)+2.3*node2Width) +"," + ((d.y)-0.5*node2Heigth) + ")";
        });

        numnodes.append("rect")
        .attr("class",numnodes)
        .attr("width", node2Width)
        .attr("height", node2Heigth)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill","#fff")
        .style("stroke","#0F9D58")
        .style("stroke-width",stkwidth2)

//appending text on numeric nodes
        numnodes.append("text")
        .data(values)

          .text(function(d) {
            return d.values;
          })
          .style("fill", "#000")
          .style("font-family","Tahoma")
          .style("font-size", "11px")
          .style("font-style","normal")
          .attr("x", node2Width/2)
          .attr("y", node2Heigth/2)
          .attr("dy", "0.35em")

        .attr("text-anchor", "middle");

          numnodes.append("title")
              .text(function(d) {
              return d.name;
          });

});//end of ajax for webservice
}

//this is the code which builds the arrow.

        svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "2 -5 10 10")
        .attr("refX", 0)
        .attr("refY", 0)
        .attr("markerWidth", 10)
        .attr("markerHeight",10)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");


      /*force.on("tick", function() {
        link.attr("x1", function(d) {
                return d.source.x + (nodeWidth / 2);
            })
            .attr("y1", function(d) {
                return d.source.y + (nodeHeight / 2);
            })
            .attr("x2", function(d) {
                return d.target.x + (nodeWidth / 2);
            })
            .attr("y2", function(d) {
                return d.target.y + (nodeHeight / 2);
            });*/
//calculations to place the arrows in the middle
            force.on("tick", function() {
            link.attr("points", function(d) {
            return (d.source.x+(nodeWidth / 2)) + "," + (d.source.y+(nodeHeight / 2)) + " " +
            ((d.target.x+ d.source.x+nodeWidth)/2) + "," + ((d.target.y+ d.source.y+nodeHeight)/2) +" "+
            (d.target.x+(nodeWidth / 2)) + "," + (d.target.y+(nodeHeight / 2)); });

        node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });


//code to place the text of the links in the center
            linkText
                    .attr("x", function(d) {
                        return ((d.source.x + d.target.x)/1.72);
                    })
                    .attr("y", function(d) {
                        return ((d.source.y + d.target.y)/1.96);
                    });


});
      function mouseover() {
        d3.select(this).select("rect").transition()
          .duration(750)
          .attr("width", 70)
          .attr("height", 25);
          d3.select(this).select("text").transition()
          .duration(750)
          .style("fill", "#000")
          .attr("x", 35)
          .attr("y", 2)
          .style("font-size", "14px");

      }

      function mouseout() {
        d3.select(this).select("rect").transition()
          .duration(750)
          .attr("width", 50)
          .attr("height", 15)
          .style("stroke-width", "1.5px");
          d3.select(this).select("text").transition()
          .duration(750)
          .style("fill", "#000")
          .attr("x", 25)
          .attr("y", 0)
          .style("font-size", "11px");
      }

    /*  function onClick(){
        document.getElementById("contents").textContent =
        graph.nodes["8"].list[1].accession;
      }*/

      function linkcolor(d){
        if(d.group == "1"){
          return "#2B60DE";
        }
        else {
          return "red";
        }
      }

      function txtcolor(d){
        if(d.group == "1"){
          return "#2B60DE";
        }
        else {
          return "red";
        }
      }


      function dblclick() {
        d3.select(this).select("rect").transition()
        .style("stroke-width", "0px");
      }
//for regular nodes
      function stkwidth(d){
        if(d.group == "1"){
          return "3px";
        }
        else{
          return "0px";
            }
      }
//for numeric nodes
      function stkwidth2(d){
        if(d.group == "1"){
          return "1.5px";
        }
        else{
          return "0px";
            }
      }



      function htmlDivs(){
        document.write("<div id= \"first\">");
        document.write("<svg id=\"mapSVG\"  viewbox=\"0 0 800 350\"></svg>");
        document.write("</div>");
        
        
        
        document.write("<div id=\"contents\" class = \"gf-content-div\">");
        document.write(" <h3><center>Click on a node to get its properties</center><br></h3>");
        document.write(" <label><center>Contents of node: </center></label>");
        document.write("<p><span id='display'></span></p>");
        document.write(" <form id = \"queryForm\">")
        document.write("</form><br/>");
        document.write(" <p><span id='display2'></span></p>");
        document.write("</div>");
        
        }

      function init() {
        svg.attr('height','100%');
        svg.attr('width','100%');
        // initialisation stuff here
      }
      






      function formSubmit(values){
        var val = JSON.stringify(values);
        
        val = JSON.parse(val);
        
         var resultVal = Object.keys(val)[0];
            //get the result val name from data.json
            if(resultVal == "protein_query"){
              cq_protein(val);
            }


            else if(resultVal == "glycan_query"){
              cq_glycan(val);
            }
      }


      
      function cq_protein(val){
        //make sure here val["name"] is same as in function from submit
        Object.assign(val["protein_query"], {operation: "AND","query_type": "search_protein"});
        cq_complexQuery(val);
      }

      function cq_glycan(val){
        Object.assign(val["glycan_query"], {operation: "AND","query_type": "search_glycan"});
        cq_complexQuery(val);
      }


      var query_list = new Array();
 
      var complexQuery={ 
        "complex_query":{ 
           "operator":"AND",
           query_list
             },
        "result_type":"protein_list"
          };
        
     


      function cq_complexQuery(query){
          

          
          query_list.push(query);
          console.log(JSON.stringify(complexQuery));
          
        
      }