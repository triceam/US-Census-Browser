

function  CensusVisualizer() {
	this.populationCategories  = [ 'Under 5', '5 to 9', '10 to 14', '15 to 19', '20 to 24', '25 to 29', '30 to 34', '35 to 39',  
								  '40 to 44', '45 to 49', '50 to 54', '55 to 59', '60 to 64', '65 to 69', '70 to 74', '75 to 79', '80 to 84', '85 over' ];
						
	this.populationTotalDataFormat = [ "dpsf0010002", "dpsf0010003", "dpsf0010004", "dpsf0010005", "dpsf0010006", "dpsf0010007", "dpsf0010008", 
									  "dpsf0010009", "dpsf0010010", "dpsf0010011", "dpsf0010012", "dpsf0010013", "dpsf0010014", "dpsf0010015", 
									  "dpsf0010016", "dpsf0010017", "dpsf0010018", "dpsf0010019" ];
	this.populationMaleDataFormat =  [ "dpsf0010021", "dpsf0010022", "dpsf0010023", "dpsf0010024", "dpsf0010025", "dpsf0010026", "dpsf0010027", 
									  "dpsf0010028", "dpsf0010029", "dpsf0010030", "dpsf0010031", "dpsf0010032", "dpsf0010033", "dpsf0010034", 
									  "dpsf0010035", "dpsf0010036", "dpsf0010037", "dpsf0010038" ];	
	this.populationFemaleDataFormat = [ "dpsf0010040", "dpsf0010041", "dpsf0010042", "dpsf0010043", "dpsf0010044", "dpsf0010045", "dpsf0010046", 
									  "dpsf0010047", "dpsf0010048", "dpsf0010049", "dpsf0010050", "dpsf0010051", "dpsf0010052", "dpsf0010053", 
									  "dpsf0010054", "dpsf0010055", "dpsf0010056", "dpsf0010057" ];	
									  
	/*this.raceCategories = [ "White", "Black or African American", "American Indian or Alaska Native", "Asian", "Native Hawaiian or Pacific Islander", "Other", "Multi-Origin: White; American Indian and Alaska Native", "Multi-Origin: White; Asian", "Multi-Origin: White; Black or African American", "Multi-Origin: White; Some Other Race"];
	this.raceDataFormat = [ "dpsf0080003", "dpsf0080004", "dpsf0080005", "dpsf0080006", "dpsf0080014", "dpsf0080019", "dpsf0080021", "dpsf0080022", "dpsf0080023", "dpsf0080024"];*/
	
	this.raceMajorCategories = [ "White", "Afr. Amer.", "Native Amer.", "Asian", "Pac. Islander", "Other", "Multi-Origin"];
	this.raceMajorDataFormat = [ "dpsf0080003", "dpsf0080004", "dpsf0080005", "dpsf0080006", "dpsf0080014", "dpsf0080019", "dpsf0080020"];
	
	this.raceMinorCategories = [ "White", "Afr. Amer.", "Native Amer.", 
								 "Asian Indian", "Chinese", "Filipino", "Japanese", "Korean", "Vietnamese", "Other Asian",
								 "Native Hawaiian", "Guamanian or Chamorro", "Samoan", "Other Pacific Islander",  
								 "Multiracial or a Hispanic/Latino", 
								 "White; Amer. Ind. and AK Native", "White; Asian", "White; African American", "White; Other", "Other"];
	this.raceMinorDataFormat = [ "dpsf0080003", "dpsf0080004", "dpsf0080005",
								 "dpsf0080007", "dpsf0080008", "dpsf0080009", "dpsf0080010", "dpsf0080011", "dpsf0080012", "dpsf0080013",  
								 "dpsf0080015", "dpsf0080016", "dpsf0080017", "dpsf0080018", 
								 "dpsf0080019", 
								 "dpsf0080021", "dpsf0080022", "dpsf0080023", "dpsf0080024", "null" ];
	this.raceMinorColorIndices = [ 0,1,2, 
								   3,3,3,3,3,3,3,
								   4,4,4,4,  
								   5, 
								   6,6,6,6,6];
	this.raceMajorRowspans = 	[  1,1,1, 
								   7,
								   4,  
								   1, 
								   5];
	
	this.householdMajorCategories = ["Family", "Non-family"];
	this.householdDataFormat = ["dpsf0130002","dpsf0130010"];
	
	this.familyHouseholdMajorCategories = ["Married", "Male, no wife", "Female, no husband"];
	this.familyHouseholdDataFormat = ["dpsf0130004", "dpsf0130006", "dpsf0130008"];
	
}

CensusVisualizer.prototype.formatDataForChart = function(data, formatArray, negate) {
	var result = [];
	
	for ( var x = 0; x<formatArray.length; x++ )
	{
		var item = data[formatArray[x]];
		if ( negate == true )
			item *= -1;
		result.push( item );
	}
	
	return result;
}

CensusVisualizer.prototype.formatDataForPieChart = function(data, categoryArray, formatArray) {
	var result = [];
	
	for ( var x = 0; x<formatArray.length; x++ )
	{
		result.push( [categoryArray[x], data[formatArray[x]]] );
	}
	
	return result;
}

CensusVisualizer.prototype.renderPopulationData = function(target, data) {
	
	
	var colors = ["#0066FF", "#EE3366"];
	var border = 0;
	var borderColor = "#BBB";
	
	var targetHeight = 500;
	var totalChartData = this.formatDataForChart( data, this.populationTotalDataFormat );
	var maleChartData = this.formatDataForChart( data, this.populationMaleDataFormat, true );
	var femaleChartData = this.formatDataForChart( data, this.populationFemaleDataFormat );
	
	var tableHTML = "<tr><th></th><th style='text-align:right'>Total</th><th style='color:" + colors[0] + "; text-align:right'>Male</th><th style='color:" + colors[1] + "; text-align:right'>Female</th></tr>";
	var chartMax = 0;
	
	for ( var x = 0; x < this.populationCategories.length; x ++ )
	{
		tableHTML += "<tr><th>" + this.populationCategories[x] + "</th><td style='text-align:right'>" + $.formatNumber(totalChartData[x], {format:"#,###", locale:"us"}) + "</td><td  style='color:" + colors[0] + "; text-align:right'>" + $.formatNumber((-1*maleChartData[x]), {format:"#,###", locale:"us"}) + "</td><td style='color:" + colors[1] + "; text-align:right'>" + $.formatNumber(femaleChartData[x], {format:"#,###", locale:"us"}) + "</td></tr>";
		chartMax = Math.max( chartMax, Math.abs(maleChartData[x]), femaleChartData[x] );
	}
	
	//alert( chartMax );
	
	if ( chartMax <= 1000 ) {
		chartMax = (Math.ceil( chartMax / 100)) * 100;
	}
	else if ( chartMax <= 5000 ) {
		chartMax = (Math.ceil( chartMax / 500)) * 500;
	}
	else if ( chartMax <= 25000 ) {
		chartMax = (Math.ceil( chartMax / 1000)) * 1000;
	}
	else if ( chartMax <= 50000 ) {
		chartMax = (Math.ceil( chartMax / 5000)) * 5000;
	}
	else if ( chartMax <= 100000 ) {
		chartMax = (Math.ceil( chartMax / 25000)) * 25000;
	}
	
	target.html( '<div style="height:' + (targetHeight + 800) + 'px"><div class="chartContainer" style="height:' + targetHeight + 'px;"><div id="totalContainer" style="position:absolute; width: 50%; top:0px; left:0px; height:' + targetHeight + 'px;"></div>' +
				 '<div id="sexesContainer" style="position:absolute; width: 50%; top:0px; right:0px; height:' + targetHeight + 'px;"></div></div>' +
				 '<div id="tableContent" style="top:' + targetHeight + 'px; "><table width="100%"  class="table">' + tableHTML + '</table></div></div>' );
		
		var chart = new Highcharts.Chart({
					colors: ["#333"],
      				chart: {
						renderTo: 'totalContainer',
						defaultSeriesType: 'column',
						backgroundColor:'rgba(0, 0, 0, 0)'
					},
					title: {
				       	style: {
				        	color: '#000',
				        },
						text: 'County Population: ' + $.formatNumber(data.dpsf0010001, {format:"#,###", locale:"us"}) 
					},
					subtitle: {
				       	style: {
				        	color: '#000',
				        },
						text: 'source: 2010.census.gov'
					},
					
					xAxis: {
						categories: this.populationCategories,
						labels: {
							 style: {
								color: '#333'
							 }
						  },
						  title: {
							 style: {
								color: '#333'
							 }
						  },
					  lineColor: '#666',
					  tickColor: '#666',
				      gridLineColor: '#999'
					},
					yAxis: {
						min: 0,
						title: {
							text: 'Population',
							 style: {
								color: '#333'
							 }
						},
						labels: {
							 style: {
								color: '#333'
							 }
						  },
					  lineColor: '#666',
					  tickColor: '#666',
				      gridLineColor: '#999'
					},
					legend: {
						layout: 'vertical',
						align: 'left',
						verticalAlign: 'top',
						x: 0,
						y: 0,
						floating: false,
						shadow: true,
						enabled:false
					},
					tooltip: {
						formatter: function() {
							return ''+ 
								this.x +': '+ this.y;
						}
					},
					plotOptions: {
						column: {
							animation:false,
							pointPadding: 0.2,
							borderWidth: border,
							shadow: false,
							borderColor: borderColor
						}
					},
				        series: [{
						name: 'Total',
						data: totalChartData
					}]
				});
				
	chart = new Highcharts.Chart({
					colors: colors,
					chart: {
						renderTo: 'sexesContainer',
						defaultSeriesType: 'bar',
						backgroundColor:'rgba(0, 0, 0, 0)'
					},
					title: {
				       	style: {
				        	color: '#000',
				        },
						text: 'Population by Sex'
					},
					subtitle: {
				       	style: {
				        	color: '#000',
				        },
						text: 'Source: 2010.census.gov'
					},
					xAxis: [{
						categories: this.populationCategories,
						reversed: false,
						enabled:false,
						labels: {
							 style: {
								color: '#333'
							 }
						  },
						  title: {
							 style: {
								color: '#333'
							 }
						  },
					  lineColor: '#666',
					  tickColor: '#666',
				      gridLineColor: '#999'
					}],
					yAxis: {
						title: {
							text: null,
							 style: {
								color: '#333'
							 }
						},
						labels: {
							formatter: function(){
								return (Math.abs(this.value) / 1000) + 'K';
							},
							 style: {
								color: '#000'
							 }
						},
					  lineColor: '#666',
					  tickColor: '#666',
				      gridLineColor: '#999',
				      min: -chartMax,
				      max: chartMax
					},
					legend: {
						enabled:false
					},
					
					plotOptions: {
						series: {
							animation:false,
							stacking: 'normal',
							shadow: false
						},
						bar: {
							borderWidth: border,
							borderColor: borderColor,
							shadow: false
						}
					},
					
					tooltip: {
						formatter: function(){
							return '<b>'+ this.series.name +', age '+ this.point.category +'</b><br/>'+
								 'Population: '+ Highcharts.numberFormat(Math.abs(this.point.y), 0);
						}
					},
					
					series: [{
						name: 'Male',
						data: maleChartData
					}, {
						name: 'Female',
						data: femaleChartData
					}]
				});
}


CensusVisualizer.prototype.renderRaceData = function(target, data) {
	
	var targetHeight = 500;
	
	var colors = Highcharts.getOptions().colors;
	//var colors = ["#30D0DD", "#C040FF", "#2F8030", "#FFC000", "#C0FF40", "#705FAF", "#FF0040", "#404000"];
	//var colors = ["#CC3333", "#33CC33", "#3333CC", "#33CC33", "#CC33CC", "#CCCC33", "#CC5511", "#1155CC"];
	var name = 'Population By Race';
				
	var innerCircleRawData = this.formatDataForChart( data, this.raceMajorDataFormat );
	var outterCircleRawData = this.formatDataForChart( data, this.raceMinorDataFormat );
	var innerCircleData = [];
	var outterCircleData = [];
	
	for (var i = 0; i < innerCircleRawData.length; i++) {
		var itemData = { category: this.raceMajorCategories[i], y:innerCircleRawData[i], color:colors[i]  }
		innerCircleData.push( itemData );
	}
	
	for (var i = 0; i < outterCircleRawData.length; i++) {
		var itemData = { category: this.raceMinorCategories[i], y:outterCircleRawData[i], color:colors[this.raceMinorColorIndices[i]] }
		outterCircleData.push( itemData );
	}
	
	outterCircleData[ outterCircleData.length-1 ].y = data[ "dpsf0080020" ] - (data[ "dpsf0080021" ] + data[ "dpsf0080022" ] + data[ "dpsf0080023" ] + data[ "dpsf0080024" ]);
	
	
	var tableHTML = "";
	var lastMajorIndex = NaN;
	
	for ( var x = 0; x < outterCircleData.length; x ++ )
	{
		tableHTML += "<tr>";
		
		if ( lastMajorIndex != this.raceMinorColorIndices[x] )
		{
			tableHTML += "<th rowspan='" + this.raceMajorRowspans[this.raceMinorColorIndices[x]] +"'>" + this.raceMajorCategories[ this.raceMinorColorIndices[x] ] + "</th>	";
			lastMajorIndex = this.raceMinorColorIndices[x]
		}
		
		tableHTML += "<th>" + this.raceMinorCategories[x] + "</th><td  style='color:" + colors[this.raceMinorColorIndices[x]] + "; text-align:right'>" + $.formatNumber(outterCircleData[x].y, {format:"#,###", locale:"us"}) + "</td></tr>";
	}
	
	target.html( '<div style="height:' + (targetHeight + 800) + 'px"><div id="chartContainer" class="chartContainer" style="position:absolute; width: 100%; top:0px; left:0px; height:' + targetHeight + 'px;"></div>' +
				 '<div id="tableContent" style="top:' + targetHeight + 'px; "><table width="100%" class="table">' + tableHTML + '</table></div></div>' );
	
	
				
				// Create the chart
				chart = new Highcharts.Chart({
					colors: colors,
					chart: {
						renderTo: 'chartContainer', 
						type: 'pie',
						backgroundColor:'rgba(0, 0, 0, 0)'
					},
					title: {
				       	style: {
				        	color: '#000',
				        },
						text: 'Population By Ethnicity/Race'
					},
					yAxis: {
						title: {
							text: ''
						}
					},
					plotOptions: {
						pie: {
							animation:false,
							shadow: true,
							borderColor: "#AAA"
						}
					},
					tooltip: {
						formatter: function() {
							return '<b>'+ this.point.category +'</b>: '+ $.formatNumber(this.y, {format:"#,###", locale:"us"});
						}
					},
					series: [{
						name: 'Major Race Classification',
						data: innerCircleData,
						size: '25%',
						dataLabels: {
							formatter: function() {
								return this.point.category;
							},
							color: 'black',
							distance: 5
						}
					}, {
						name: 'Minor Race Classification',
						data: outterCircleData,
						innerSize: '60%',
						size: '75%',
						dataLabels: {
							formatter: function() {
								return  '<b>'+ this.point.category +':</b> '+ $.formatNumber(this.y, {format:"#,###", locale:"us"});
							},
							distance: 40
						}
					}]
				});
}


CensusVisualizer.prototype.renderHouseholdData = function(target, data) {
	
	var targetHeight = 500;
	
	
	var tableHTML = "<table width='100%' class='table'>";
	
	tableHTML += "<tr><th style='padding-left:00px;'>Total Households</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130001, {format:"#,###", locale:"us"})  + "</td></tr>";	
	tableHTML += "<tr><th style='padding-left:40px;'>	Family households (families)</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130002, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>		With own children under 18 years</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130003, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>    	Husband-wife family</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130004, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>    		With own children under 18 years</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130005, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>    	Male householder, no wife present</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130006, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>    		With own children under 18 years</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130007, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>   	 Female householder, no husband present</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130008, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>    		With own children under 18 years</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130009, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:40px;'>   	Nonfamily households</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130010, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>    	Householder living alone</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130011, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>     		Male</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130012, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:160px;'>      			65 years and over</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130013, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>     		Female</th><td style='text-align:right;'>" +$.formatNumber( data.dpsf0130014, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:160px;'>      			65 years and over</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0130015, {format:"#,###", locale:"us"}) + "</td></tr>";
	
	tableHTML += "<tr><th style='padding-left:00px;'>Total Population</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120001, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:40px;'>	In households</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120002, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>		Householder</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120003, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>		Spouse</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120004, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>		Child</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120005, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>			Own child under 18 years</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120006, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>		Other relatives</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120007, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>			Under 18 years</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120008, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>			65 years and over</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120009, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>	    Nonrelatives</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120010, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>    		Under 18 years</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120011, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>     		65 years and over</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120012, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>     		Unmarried partner</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120013, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:40px;'>   	In group quarters</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120014, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>		Institutionalized population</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120015, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>     		Male</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120016, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>     		Female</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120017, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:80px;'>    	Noninstitutionalized population</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120018, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>     		Male</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120019, {format:"#,###", locale:"us"}) + "</td></tr>";
	tableHTML += "<tr><th style='padding-left:120px;'>     		Female</th><td style='text-align:right;'>" + $.formatNumber(data.dpsf0120020, {format:"#,###", locale:"us"}) + "</td></tr>";
	
	tableHTML += "</table>";
		
	
	
	
	target.html( '<div style="height:' + (targetHeight + 1400) + 'px"><div class="chartContainer" style="height:' + targetHeight + 'px;"><div id="totalContainer" style="position:absolute; width: 50%; top:0px; left:0px; height:' + targetHeight + 'px;; margin: 0 auto"></div>' +
				 '<div id="familyContainer" style="position:absolute; width: 50%; top:0px; right:0px; height:' + targetHeight + 'px;; margin: 0 auto"></div></div>' +
				 '<div id="tableContent" style="top:' + targetHeight + 'px; ">' + tableHTML + '</div></div>');
				
				chart = new Highcharts.Chart({
					chart: {
						renderTo: 'totalContainer',
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						backgroundColor:'rgba(0, 0, 0, 0)'
					},
					title: {
				       	style: {
				        	color: '#000',
				        },
						text: 'Total Households: ' + $.formatNumber(data.dpsf0130001, {format:"#,###", locale:"us"})
					},
					tooltip: {
						formatter: function() {
							return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %';
						}
					},
					plotOptions: {
						pie: {
							allowPointSelect: false,
							cursor: 'pointer',
							animation:false,
							dataLabels: {
								enabled: true,
								color: '#000000',
								connectorColor: '#000000',
								formatter: function() {
									return '<b>'+ this.point.name +'</b><br/>'+ $.formatNumber(this.y, {format:"#,###", locale:"us"})  + '<br/>'+ $.formatNumber(this.percentage, {format:"#.00", locale:"us"})  +' %';
								}
							},
            				size: "40%", 
							borderColor: "#AAA"
						}
					},
				    series: [{
						type: 'pie',
						name: 'Household Data',
						data: this.formatDataForPieChart( data, this.householdMajorCategories, this.householdDataFormat )
					}]
				});
				
				chart = new Highcharts.Chart({
					chart: {
						renderTo: 'familyContainer',
						plotBackgroundColor: null,
						plotBorderWidth: null,
						plotShadow: false,
						backgroundColor:'rgba(0, 0, 0, 0)'
					},
					title: {
				       	style: {
				        	color: '#000',
				        },
						text: 'Family Households'
					},
					tooltip: {
						formatter: function() {
							return '<b>'+ this.point.name +'</b>: '+ $.formatNumber(this.percentage, {format:"#.00", locale:"us"})  +' %';
						}
					},
					plotOptions: {
						pie: {
							allowPointSelect: false,
							cursor: 'pointer',
							animation:false,
							dataLabels: {
								enabled: true,
								color: '#000000',
								connectorColor: '#000000',
								formatter: function() {
									return "<b>"+ this.point.name + "</b><br/>" + $.formatNumber(this.percentage, {format:"#.00", locale:"us"}) + " %";
								}
							},
            				size: "40%", 
							borderColor: "#AAA"
						}
					},
				    series: [{
						type: 'pie',
						name: 'Browser share',
						data: this.formatDataForPieChart( data, this.familyHouseholdMajorCategories, this.familyHouseholdDataFormat )
					}]
				});
}

var censusVisualizer = new CensusVisualizer();
