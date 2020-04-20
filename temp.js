d3.select("#jk").on("input",dupdate)
        let res;
        let c1;
        let c2;
        let plotdata;
        let plottext;
        let selectTag = d3.select("#c1");
        let selectTag2 = d3.select("#c2");
        
        var margin2 = {top: 10, right: 30, bottom: 30, left: 50},
            width2 = 550 - margin2.left - margin2.right,
            height2 = 500 - margin2.top - margin2.bottom;
        
        var svg2 = d3.select('#linegraph').append('svg').attr('width', width2).attr('height', height2).style("background-color","white").style("border", "5px solid black").style("border-radius", "20px");

        var xAxis2 = svg2.append("g")
            .attr("transform", "translate(0,430)")
        var yAxis2 =svg2.append("g") .attr("transform", "translate(50,0)");



        function compare()
        {
           c1 = d3.select("#c1").property("value");
           c2 = d3.select("#c2").property("value");
          console.log(c1,c2)
        }

        function optionupdate(optionsData)
        {
        var options = selectTag.selectAll('option')
            .data(optionsData);
        options.enter()
      .append('option')
      .attr('value', function(d) {
        return d;
      })
      .text(function(d) {
        return d;
      });
var options = selectTag2.selectAll('option2')
            .data(optionsData);
        options.enter()
      .append('option')
      .attr('value', function(d) {
        return d;
      })
      .text(function(d) {
        return d;
      });
        }
       
        dupdate();

       

        function dupdate(){


            let count = d3.select("#jk").property("value")
            count=parseInt(count)

            d3.csv("td2.csv",function(data){            
            
            var result = data.filter((d) => { return d.DAY < count; });
            var result1 = data.filter((d) => { return d.DAY == count; });
            
            var sumstat = d3.nest() 
            .key(function(d) { return d.Country;})
            .entries(result);

            res = sumstat.map(function(d){ return d.key })
            optionupdate(res)


            plottext = result1.filter((d) => { return d.Country==c1||d.Country==c2; });
            plotdata =  result.filter((d) => { return d.Country==c1||d.Country==c2; });
            console.log(plotdata)
            console.log(plottext)


            

            console.log(result1)
           
            var x = d3.scaleLinear()
            .domain(d3.extent(data, function(d) { return +d.DAY; }))
            .range([ 50, width2 ]);

            xAxis2.call(d3.axisBottom(x).ticks(10));

            
            var y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return +d.Cases; })])
            .range([ height2-30,0]);

            
            yAxis2.call(d3.axisLeft(y));
            
            var color = d3.scaleOrdinal()
            .domain(res)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])
			
           var lines = svg2.selectAll(".lines").data(sumstat)
           
           
 	        	
            lines.enter()
            .append("path").attr("class","lines").merge(lines)
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
            return d3.line()
            .x(function(d) { return x(d.DAY); })
            .y(function(d) { return y(+d.Cases); })
            (d.values)}).attr("data-legend",function(d) { return d.key}).on('mouseover', function(){d3.select(this)
            .style("opacity", 1)
            .style("stroke","red")
            .style("stroke-width",3);}).on('mouseout',function(){d3.select(this)
            .style("opacity", 1)
            .style("stroke","grey")
            .style("stroke-width",3);})


    var text = svg2.selectAll(".ltext").data(result1)

     text.enter().append("text").attr("class","ltext").merge(text)
      .attr("x", (d) => x(d.DAY))
      .attr("y", (d => y(d.Cases)))
      .attr("dy", ".35em")
      .text(function(d) { return d.Country; });

    text.exit().remove();

    var text2 = svg2.selectAll(".ltext2").data(result1)

     text2.enter().append("text").attr("class","ltext2").merge(text2)
      .attr("x", (d) => x(d.DAY))
      .attr("y", (d) => (y(d.Cases)+10))
      .attr("dy", ".35em")
      .text(function(d) { return d.Cases; });

    text2.exit().remove();

      
            
       lines.exit().remove();

                   
        })
       
        }
