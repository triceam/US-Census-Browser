<cfcomponent>
	
    <cffunction name="getStates" access="remote" returntype="array">
    	
        <cfset var result = ArrayNew(1)>
        <cfset var statesQuery = "">
        
        <cfquery name="statesQuery" datasource="census"
        		 cachedwithin="#createTimespan(365,0,0,0)#">
        	select distinct stusab 
            from geo_header 
            order by stusab asc
        </cfquery>
     
     	<cfloop query="statesQuery">
            <cfset ArrayAppend( result, stusab )>
        </cfloop>
    
    	<cfreturn result>
    
    </cffunction>
    
    <cffunction name="getStateCounties" access="remote" returntype="array">
		<cfargument name="state" type="string" required="yes">
    	
        <cfset var counties = "">
        <cfquery name="counties" datasource="census"
        		 cachedwithin="#createTimespan(365,0,0,0)#">
        	select stusab, logrecno, county, name, intptlat, intptlon, pop100
            from geo_header 
            where stusab = <cfqueryparam cfsqltype="CF_SQL_CHAR" value="#state#"/> and county is not null and sumlev = 50
            order by name
        </cfquery>
     
    	<cfreturn QueryToArrayOfStructures(counties)>
    
    </cffunction>
    
    
    <cffunction name="getCountyDetails" access="remote" returntype="array">
		<cfargument name="state" type="string" required="yes">
		<cfargument name="county" type="numeric" required="yes">
    	
        <cfset result = ArrayNew(1)>
        <cfquery name="details" datasource="census"
        		 cachedwithin="#createTimespan(365,0,0,0)#">
        	select 	county, countycc, countyns, countysc, 
        			dpsf0010001, dpsf0010002, dpsf0010003, dpsf0010004, dpsf0010005, dpsf0010006, dpsf0010007, dpsf0010008, dpsf0010009, dpsf0010010, dpsf0010011, dpsf0010012, dpsf0010013, dpsf0010014, dpsf0010015, dpsf0010016, dpsf0010017, dpsf0010018, dpsf0010019, dpsf0010020, dpsf0010021, dpsf0010022, dpsf0010023, dpsf0010024, dpsf0010025, dpsf0010026, dpsf0010027, dpsf0010028, dpsf0010029, dpsf0010030, dpsf0010031, dpsf0010032, dpsf0010033, dpsf0010034, dpsf0010035, dpsf0010036, dpsf0010037, dpsf0010038, dpsf0010039, dpsf0010040, dpsf0010041, dpsf0010042, dpsf0010043, dpsf0010044, dpsf0010045, dpsf0010046, dpsf0010047, dpsf0010048, dpsf0010049, dpsf0010050, dpsf0010051, dpsf0010052, dpsf0010053, dpsf0010054, dpsf0010055, dpsf0010056, dpsf0010057, dpsf0020001, dpsf0020002, dpsf0020003, dpsf0030001, dpsf0030002, dpsf0030003, dpsf0040001, dpsf0040002, dpsf0040003, dpsf0050001, dpsf0050002, dpsf0050003, dpsf0060001, dpsf0060002, dpsf0060003, dpsf0070001, dpsf0070002, dpsf0070003, dpsf0080001, dpsf0080002, dpsf0080003, dpsf0080004, dpsf0080005, dpsf0080006, dpsf0080007, dpsf0080008, dpsf0080009, dpsf0080010, dpsf0080011, dpsf0080012, dpsf0080013, dpsf0080014, dpsf0080015, dpsf0080016, dpsf0080017, dpsf0080018, dpsf0080019, dpsf0080020, dpsf0080021, dpsf0080022, dpsf0080023, dpsf0080024, dpsf0090001, dpsf0090002, dpsf0090003, dpsf0090004, dpsf0090005, dpsf0090006, dpsf0100001, dpsf0100002, dpsf0100003, dpsf0100004, dpsf0100005, dpsf0100006, dpsf0100007, dpsf0110001, dpsf0110002, dpsf0110003, dpsf0110004, dpsf0110005, dpsf0110006, dpsf0110007, dpsf0110008, dpsf0110009, dpsf0110010, dpsf0110011, dpsf0110012, dpsf0110013, dpsf0110014, dpsf0110015, dpsf0110016, dpsf0110017, dpsf0120001, dpsf0120002, dpsf0120003, dpsf0120004, dpsf0120005, dpsf0120006, dpsf0120007, dpsf0120008, dpsf0120009, dpsf0120010, dpsf0120011, dpsf0120012, dpsf0120013, dpsf0120014, dpsf0120015, dpsf0120016, dpsf0120017, dpsf0120018, dpsf0120019, dpsf0120020, dpsf0130001, dpsf0130002, dpsf0130003, dpsf0130004, dpsf0130005, dpsf0130006, dpsf0130007, dpsf0130008, dpsf0130009, dpsf0130010, dpsf0130011, dpsf0130012, dpsf0130013, dpsf0130014, dpsf0130015, dpsf0140001, dpsf0150001, dpsf0160001, dpsf0170001, dpsf0180001, dpsf0180002, dpsf0180003, dpsf0180004, dpsf0180005, dpsf0180006, dpsf0180007, dpsf0180008, dpsf0180009, dpsf0190001, dpsf0200001, dpsf0210001, dpsf0210002, dpsf0210003, dpsf0220001, dpsf0220002, dpsf0230001, dpsf0230002, intptlat, intptlon, name, pop100, state, statens, geo_header.stusab
            from geo_header, detail 
            where geo_header.stusab = <cfqueryparam cfsqltype="CF_SQL_CHAR" value="#state#"/> and 
            	  geo_header.county = <cfqueryparam cfsqltype="CF_SQL_INTEGER" value="#county#"/> and 
                  geo_header.logrecno = detail.logrecno and geo_header.stusab = detail.stusab and
                  sumlev = 50
        </cfquery>
     
    	<cfreturn QueryToArrayOfStructures(details)>
    
    </cffunction>
    
    <cffunction name="QueryToArrayOfStructures" returntype="array">
    
		<cfargument name="theQuery" type="query" required="yes">
		<cfscript>
   			var theArray = arraynew(1);
			var cols = ListtoArray(theQuery.columnlist);
			var row = 1;
			var thisRow = "";
			var col = 1;
    
			for(row = 1; row LTE theQuery.recordcount; row = row + 1){
				thisRow = structnew();
				for(col = 1; col LTE arraylen(cols); col = col + 1){
					thisRow[lcase(cols[col])] = theQuery[cols[col]][row];
        		}
        		arrayAppend(theArray,duplicate(thisRow));
    		}
		</cfscript>
    	<cfreturn theArray>
    </cffunction>

    
</cfcomponent>
