// JavaScript Document


function ApplicationController() {
	/* YOUR CONFIG VARIABLES HERE */
	this.serverRoot = "http://myserver.com";
	this.serviceBase = "/path/to/my/cfc/ServicesDEBUG.cfc";
	this.mapKey = "your google maps key";
	
	
	this.states = [];
	this.activeState = null;
	this.counties = [];
	this.activeCounty = null;
	this.activeCountyDetails = null;
	this.activeDataView = null;
}


ApplicationController.prototype.init = function() {
	this.loadStates();
}

ApplicationController.prototype.loadStates = function() {
	
	$("#states").html( "<div class='activityIndicator'></div>" );
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
	$("#counties").html( "<div class='activityIndicator'></div>" );
	if ( this.countyScroller )
			this.countyScroller.scrollTo(0,0, 300);
}

ApplicationController.prototype.renderStates = function() {
	
	var html = "<ul id='statesScroller'>";
	for ( var i = 0; i < this.states.length; i ++ )
	{
		html += "<li id='state" + this.states[i] + "' onclick='controller.selectState(event, \"" + this.states[i] + "\")'>" + this.states[i] + "</li>";	
	}
	html += "</ul>";
	$("#states").html( html );
	if ( this.stateScroller != null )
		this.stateScroller.refresh();
	else
		this.stateScroller = new iScroll('stateWrapper');
}


ApplicationController.prototype.renderCounties = function() {
	
	var html = "<ul id='countiesScroller'>";
	for ( var i = 0; i < controller.counties.length; i ++ )
	{
		html += "<li id='county" + controller.counties[i].county + "'onclick='controller.selectCounty(event, \"" + i + "\")'>" + controller.counties[i].name + "</li>";	
	}
	html += "</ul>";
	$("#counties").html( html );
	if ( this.countyScroller != null )
		this.countyScroller.refresh();
	else
		this.countyScroller = new iScroll('countyWrapper');
}


ApplicationController.prototype.selectCounty = function(event, countyIndex) {
	
	$('#countiesScroller li').removeClass('listSelected');
	$(event.target).addClass('listSelected');
	
	var county = this.counties[countyIndex];
	this.activeCounty = county;
	this.renderContent( true );
	this.getCountyDetails( county.stusab, county.county );
}

ApplicationController.prototype.renderContent = function(loading) {
	
	var html = "";
	
	if( loading )
	{
		var mapURL = "http://maps.google.com/maps/api/staticmap?center=" + this.activeCounty.intptlat + "," + this.activeCounty.intptlon + "&zoom=8&size=200x84&maptype=roadmap&key=" + this.mapKey + "&sensor=true";
                         
		
		html += "<div>";
		html += "<img align='right' style='border: 1px solid #999999' src=\"" + mapURL + "\" />";
		html += "<h1>" + this.activeCounty.name + ", " + this.activeCounty.stusab + "</h1>";
		html += "<strong>Population:</strong> " + $.formatNumber(this.activeCounty.pop100, {format:"#,###", locale:"us"}) + "<br/>";
		html += "<strong>Approx. Location:</strong> " + this.activeCounty.intptlat + "," + this.activeCounty.intptlon;
		html += "</div>";
		
		$("#contentHeader").html( html );
		$("#activeContent").html( "<div class='activityIndicator'></div>" );
		$("#contentFooter").addClass( "hidden" );
	}
	
	//render data
	else
	{
		$("#contentFooter").removeClass( "hidden" );
		var detail = this.activeCountyDetails[ 0 ];
		
		switch( this.activeDataView )
		{
			case "race":
				censusVisualizer.renderRaceData( $("#activeContent"), detail );
				$("#population_li").removeClass( "active" );
				$("#race_li").addClass( "active" );
				$("#household_li").removeClass( "active" );
				break;
			case "household":
				censusVisualizer.renderHouseholdData( $("#activeContent"), detail );
				$("#population_li").removeClass( "active" );
				$("#race_li").removeClass( "active" );
				$("#household_li").addClass( "active" );
				break;
			default:
				censusVisualizer.renderPopulationData( $("#activeContent"), detail );
				$("#population_li").addClass( "active" );
				$("#race_li").removeClass( "active" );
				$("#household_li").removeClass( "active" );
				break;	
		}
		
	}

	if ( this.scrollContent != null ) {
		this.scrollContent.refresh();
		this.scrollContent.scrollTo(0,0,300);
	}
	else
		this.scrollContent = new iScroll('contentScrollableInstance');
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

ApplicationController.prototype.showAboutDetail = function() {
	alert("about");
}



var controller = new ApplicationController();


$(document).ready(function() {
	
	$(document).bind( "touchmove", function (e) { e.preventDefault(); return false; } );
	controller.init();
	$('#page').removeClass("hidden");
});
