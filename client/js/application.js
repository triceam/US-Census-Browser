// JavaScript Document


function ApplicationController() {
	/* YOUR CONFIG VARIABLES HERE */
	
	this.serverRoot = "http://www.yourserver.com";
	this.serviceBase = "/path/to/your/cfc/Services.cfc";
	this.mapKey = "ABQIAAAAXjVXn0An0pUKzNWtB0K0ZxSEFrceJ9hFxzpuRIy1GzUBCsWR3xTi1ogOxu49s_A4IIH2Fu-a6BjrUQ";
	
	
	this.states = [];
	this.activeState = null;
	this.counties = [];
	this.activeCounty = null;
	this.activeCountyDetails = null;
	this.activeDataView = "population";
}


ApplicationController.prototype.init = function() {
	this.loadStates();
}

ApplicationController.prototype.loadStates = function() {
	
	$.ajax({
	  url: this.serverRoot + this.serviceBase + "?method=getStates&returnformat=json",
	  success: this.onStatesLoaded,
	  error: this.onStatesError
	});
}

ApplicationController.prototype.onStatesLoaded = function(data, textStatus, jqXHR) {
	
	controller.states = eval( data );
	controller.renderStates();
}

ApplicationController.prototype.onStatesError = function(jqXHR, textStatus, errorThrown) {
	
	$("#states").html( "<div style='padding:20px'>Error loading data.  Please verify your network connection and try again.  <br/><br/>  <a href='javascript:controller.loadStates();' class='btn danger'>Retry</a></div>" );
}

ApplicationController.prototype.getStateCounties = function(state) {
	
	this.activeState = state;
	this.activeCounty = null;
	this.counties = [];
	$.ajax({
	  url: this.serverRoot + this.serviceBase + "?method=getStateCounties&state=" + state + "&returnformat=json",
	  success: this.onStateCountiesLoaded,
	  error: this.onStateCountiesError
	});
}

ApplicationController.prototype.onStateCountiesLoaded = function(data, textStatus, jqXHR) {
	
	controller.counties = eval( data );
	controller.renderCounties();
}

ApplicationController.prototype.reloadStateCounties = function() {
	$("#counties").html( "<div class='activityIndicator'></div>" );
	this.getStateCounties( this.activeState );
}

ApplicationController.prototype.onStateCountiesError = function(jqXHR, textStatus, errorThrown) {
	
	$("#counties").html( "<div style='padding:20px'>Error loading data.  Please verify your network connection and try again.  <br/><br/>  <a href='javascript:controller.reloadStateCounties();' class='btn danger'>Retry</a></div>" );
}



ApplicationController.prototype.getCountyDetails = function(state, county) {
	
	this.activeState = state;
	this.activeCounty = county;
	this.activeCountyDetails = null;
	$.ajax({
	  url: this.serverRoot + this.serviceBase + "?method=getCountyDetails&state=" + state + "&county=" + county + "&returnformat=json",
	  success: this.onCountyDetailsLoaded,
	  error: this.onCountyDetailsError
	});
}

ApplicationController.prototype.onCountyDetailsLoaded = function(data, textStatus, jqXHR) {
	
	controller.activeCountyDetails = eval( data );
	controller.renderContent(false);
}

ApplicationController.prototype.reloadCountyDetails = function() {
	$("#activeContent").html( "<div class='activityIndicator'></div>" );
	this.getCountyDetails( this.activeState, this.activeCounty );
}

ApplicationController.prototype.onCountyDetailsError = function(jqXHR, textStatus, errorThrown) {
	
	$("#activeContent").html( "<div style='padding:20px'>Error loading data.  Please verify your network connection and try again.  <br/><br/>  <a href='javascript:controller.reloadCountyDetails();' class='btn danger'>Retry</a></div>" );
}


ApplicationController.prototype.selectState = function(event, state) {
	
	$('#statesScroller li').removeClass('listSelected');
	$(event.target).addClass('listSelected');
	
	this.getStateCounties( state );
	
	var countiesView = {
		backLabel: "States",
		title: "Select County",
		view: $('<div id="counties"><div class="activityIndicator"></div></div>')
	};
	window.splitViewNavigator.pushSidebarView( countiesView );
}

ApplicationController.prototype.renderStates = function() {
	
	var html = "<ul id='statesScroller'>";
	for ( var i = 0; i < this.states.length; i ++ )
	{
		html += "<li id='state" + this.states[i] + "' onclick='controller.selectState(event, \"" + this.states[i] + "\")'>" + this.states[i] + "</li>";	
	}
	html += "</ul>";
	$("#states").html( html );
	window.splitViewNavigator.sidebarViewNavigator.resetScroller();
}


ApplicationController.prototype.renderCounties = function() {
	
	var html = "<ul id='countiesScroller'>";
	for ( var i = 0; i < controller.counties.length; i ++ )
	{
		html += "<li id='county" + controller.counties[i].county + "'onclick='controller.selectCounty(event, \"" + i + "\")'>" + controller.counties[i].name + "</li>";	
	}
	html += "</ul>";
	$("#counties").html( html );
	window.splitViewNavigator.sidebarViewNavigator.resetScroller();
}


ApplicationController.prototype.selectCounty = function(event, countyIndex) {
	
	$('#countiesScroller li').removeClass('listSelected');
	$(event.target).addClass('listSelected');
	
	var county = this.counties[countyIndex];
	this.activeCounty = county;
	this.renderContent( true );
	
	var self = this;
	//use a delay to allow for a smooth transition before requesting data
	setTimeout( function() { 
		self.getCountyDetails( county.stusab, county.county );
		}, 350);
}

ApplicationController.prototype.renderContent = function(loading) {
	
	var html = "";
	
	if( loading )
	{
		
		//var mapURL = "http://maps.google.com/maps/api/staticmap?center=" + this.activeCounty.intptlat + "," + this.activeCounty.intptlon + "&zoom=8&size=200x84&maptype=roadmap&key=" + this.mapKey + "&sensor=true";
		var mapURL = "http://staticmap.openstreetmap.de/staticmap.php?center=" + this.activeCounty.intptlat + "," + this.activeCounty.intptlon + "&zoom=8&size=200x84&maptype=mapnik";
      
		html += "<div style='min-width:100%;height:100%'><div style='padding:10px;background:rgba(255,255,255,1)'>";
		html += "<img align='right' style='border: 1px solid #999999' src=\"" + mapURL + "\" />";
		html += "<h1>" + this.activeCounty.name + ", " + this.activeCounty.stusab + "</h1>";
		html += "<strong>Population:</strong> " + $.formatNumber(this.activeCounty.pop100, {format:"#,###", locale:"us"}) + "<br/>";
		html += "<strong>Approx. Location:</strong> " + this.activeCounty.intptlat + "," + this.activeCounty.intptlon;
		
		html += '	<div class="btn-group" data-toggle="buttons-radio" style="padding-top:10px;">';
		html += '	  <button class="btn ' + (this.activeDataView == "population" ? 'active' : '') + '" data-toggle="button" onclick="javascript:controller.showPopulationData()">Age Profile</button>';
		html += '	  <button class="btn ' + (this.activeDataView == "race" ? 'active' : '') + '" data-toggle="button" onclick="javascript:controller.showRaceData()">Racial Profile</button>';
		html += '	  <button class="btn ' + (this.activeDataView == "household" ? 'active' : '') + '" data-toggle="button" onclick="javascript:controller.showHouseholdData()">Household</button>';
		html += '	  <button class="btn ' + (this.activeDataView == "map" ? 'active' : '') + '" data-toggle="button" onclick="javascript:controller.showMapDataView()">Interactive Map</button>';
		html += '	</div></div>';
		html += '	<div id="activeContent"><div class="activityIndicator"></div></div>';
		html += "</div>";
		
		this.contentView = { 
			title: "Census Data for " + this.activeCounty.name + ", " + this.activeCounty.stusab,
			view: $(html),
			scroll: true,
			backLabel: this.lastAction,
			maintainScrollPosition:false
		}
		
		window.splitViewNavigator.replaceBodyView( this.contentView );
		window.splitViewNavigator.hideSidebar();
		
		//this is to correct a bug in highcharts that causes charts to render at the wrong size when changing device orientation
		/*
		var self = this;
		clearTimeout( window.renderContentTimeout );
		$("#activeContent").bind( "resize", function (event){ 
			
			try {
				window.renderContentTimeout = setTimeout( 
					function() { 
						//alert();
						self.renderContent() 
					}
				, 50)
			}
			catch(e) { 
				alert( e.toString() );
			}
		});*/
		
		//$("#contentHeader").html( html );
		//$("#activeContent").html( "<div class='activityIndicator'></div>" );
		//$("#contentFooter").addClass( "hidden" );
	}
	
	//render data
	else
	{
		/*if ( this.contentScroller ) {
		    this.contentScroller.destroy();
		    this.contentScroller= undefined;
		}*/
		
		//$("#contentFooter").removeClass( "hidden" );
		var detail = this.activeCountyDetails[ 0 ];
		
		//console.log( this.activeCounty, detail.county );
		if ( this.activeCounty != detail.county ) {
			return;
		}
		
		this.contentView.view.css( "height", "auto" ); 
		var activeContent = $("#activeContent");
		activeContent.css( "height", "auto" );
		
		try {
			switch( this.activeDataView )
			{
				case "race":
					censusVisualizer.renderRaceData( activeContent, detail );
					break;
					
				case "household":
					censusVisualizer.renderHouseholdData( activeContent, detail );
					break;
					
				case "map":
					this.contentView.view.css( "height", "100%" );
					activeContent.css( "height", "100%" );
					activeContent.html( '<div id="map" ></div>' );
					
					var map = new L.Map('map');

                    var tileURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        attribution = 'Map data &copy; 2011 OpenStreetMap',
                        layer = new L.TileLayer(tileURL, {maxZoom: 18, attribution: attribution});
                    
                    map.setView(new L.LatLng(detail.intptlat, detail.intptlon), 10).addLayer(layer);
            
					break;
				default:
					censusVisualizer.renderPopulationData( activeContent, detail );
					break;	
			}
			
			/*if( this.activeDataView != "map" ) {
			
			    var self= this;
			    setTimeout( function() {
					self.contentScroller = new iScroll("activeContentWrapper");
				}, 350 );
			}*/
			if( this.activeDataView == "map" ) {
				window.splitViewNavigator.bodyViewNavigator.destroyScroller();
			}
			else {
    			window.splitViewNavigator.bodyViewNavigator.resetScroller();
			}
		}
		catch( e ) {
			alert( e.toString() );
		}
	}
		
}

ApplicationController.prototype.showPopulationData = function() {
	this.activeDataView = "population";
	this.renderContent();
}

ApplicationController.prototype.showRaceData = function() {
	this.activeDataView = "race";
	this.renderContent();
}

ApplicationController.prototype.showHouseholdData = function() {
	this.activeDataView = "household";
	this.renderContent();
}

ApplicationController.prototype.showMapDataView = function() {
	this.activeDataView = "map";
	this.renderContent();
}

ApplicationController.prototype.showAboutDetail = function() {
	alert("about");
}



var controller = new ApplicationController();
var statesView = {
		title: "Select State",
		view: $('<div id="states"><div class="activityIndicator"></div></div>')
	};
var bodyView = {
		title: "US Census Browser",
		view: $('<div width="100%" height="100%" class="defaultView"><div class="alert alert-block" style="position: absolute; top:25px; left:25px; right:25px"><h2>' + 
						'Please select a state and county to begin.' + 
                '</h2></div><div id="copyright">&copy; 2012 Andrew Trice</div>' + 
                '<div id="dataDisclaimer">Data Available from U.S. Census Department</div></div>')
	};
	

$(document).ready(function() {
	
	$(document).bind( "touchmove", function (e) { e.preventDefault(); return false; } );
	
	//adding delay actually makes the app start faster, and enables loading animation to be displayed
	setTimeout( function() { controller.init(); } , 100 );
	
	bodyView.view.click( function(event) { 
		window.splitViewNavigator.showSidebar(); 
	});
	
	//Setup the ViewNavigator
	new SplitViewNavigator( '#pageContent', "Select Region", "btn btn-inverse" );	
	window.splitViewNavigator.pushSidebarView( statesView );
	window.splitViewNavigator.pushBodyView( bodyView );
	window.splitViewNavigator.showSidebar();
});


