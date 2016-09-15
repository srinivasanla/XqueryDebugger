	var filename = "";
	var marker;
	var lineNo=[];
	/* Z-Tree Complexes */
	var setting = {
		data: {
				key: {
					title:"t"
				},
				simpleData: {
					enable: true
				}
			},
			callback: {
				onClick: onClick
			}	
	};
	function onClick(event, treeId, treeNode, clickFlag) {
		getCode(treeNode.name);
	}
	
	/* CodeMirror Complexes */
	function getCode(uri) {
		console.log("i'm in getcode()");
		filename = uri;
		//console.log("its Here!"+filename);
		var getfile = /* Path to the file location */+uri;
		var bp = /* Path to the breakpoint.xqy */;
		console.log(getfile);
		$.getJSON(getfile, function(json_code) {
			$(".debuger").show();
			editor.focus();
			editor.getDoc().setValue(json_code.code);
			editor.refresh();
		})
		.done(function() {
			$.getJSON(bp, function(json_breakpoints) {
			var object = json_breakpoints.result.expr;
			$.each(object, function(){
				if('/'.concat(filename) === this.uri){
					editor.refresh();
					console.log("line no in getcode"+this.line);
					var line = this.line-1;
					var objects = $(".CodeMirror-code").children();
					var t = objects[line];
					var div = '<div class="CodeMirror-linenumber CodeMirror-gutter-elt"style="left: 0px; width: 21px;">'+this.line+'</div><div class="CodeMirror-gutter-elt" style="left: 29px; width: 10px;"><div style="color: rgb(10, 222, 46);">●</div></div>';
					var $t = $(t); 
					var divs = $t.find(".CodeMirror-gutter-wrapper").html(div);
				}
			});
		});
		});
	}
	
	function makeMarker() {
	  marker = document.createElement("div");
	  marker.style.color = "#822";
	  marker.innerHTML = "●";
	  return marker;
	}
	function markerSuccess() {
	  marker = document.createElement("div");
	  marker.style.color = "#0ADE2E";
	  marker.innerHTML = "●";
	  return marker;
	}
	
	/* Set BreakPoint */
	function setBreakpoint(line,n,info,cm) {
		console.log("i'm in setBreakpoint()");
		console.log("cm in here"+cm );
		console.log("info in here"+info );
		var url = /*Path to the setBreakpoint xqy */
		$.getJSON(url, function(json) {
				if(json.debuger.line){
					console.log("LineId :" + json.debuger.line );
					cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : markerSuccess());
				}
				else {
					cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
					console.log("Connection Lost");
				}
			});
		console.log(url);
		viewBreakpoints();
	}
	
	/* view Breakpoint table */
	function viewBreakpoints() {
		console.log("i'm in viewBreakpoints()");
		var u = /*Path to the getBreakpoint xqy */
		var BP_List = " ";
		var i ;
		$.getJSON(u, function(json_breakpoints) {
			var object = json_breakpoints.result.expr;
			$.each(object, function(){
							 BP_List += '<tr><td><a href="#" onClick="deleteBreakpoint(\''+this.exprId+'\','+this.line+')">✗ </a></td><td>'+this.exprId+'</td><td>'+this.uri+'</td><td>'+this.line+'</td><td>'+this.exprSource+'</td></tr>';
							 lineNo[lineNo.length+1] = this.line;
							});
			//console.log("BP_List" +BP_List);
			$(".breakpointData").html(BP_List);
			$(".breakpoint-table").show();
		});
	}
	
	function deleteBreakpoint(id1,lineNo)	{
		console.log("i'm in deleteBreakpoint()");
		var url = /*Path to the clearBreakpoint xqy */
		console.log(url);
		$.getJSON(url, function(json_breakpoints) {
		})
		.done(function() {
			console.log( "success" );
			viewBreakpoints();
			refereshCode(lineNo);
		})
		.fail(function() {
			alert("error in deletion");
			console.log( "error in deletion" );
		});
	}
  
	function refereshCode(lineNo) {
      console.log("i'm in refereshCode()");
	  var objects = $(".CodeMirror-code").children();
	  var temp = $(".CodeMirror-code").children()[lineNo-1];
	  var div = '<div class="CodeMirror-linenumber CodeMirror-gutter-elt" style="left: 0px; width: 21px;">'+lineNo+'</div>';
	  var t = objects[lineNo-1];
	  var $t = $(t); 
	  var divs = $t.find(".CodeMirror-gutter-wrapper").html(div);
	  console.log("success");
	}
	
	function getExpressions() {
		var wage = $("#expr").val();
		var table = document.getElementById("expression-table");
		var url = /*Path to the getBreakpointExpressions xqy */
		var k = event.keyCode || event.which;
				console.log( "1st "+$("#expression-table tr").length );
		if(k == 13) {
			//alert(wage);
			$.getJSON(url, function(json_expressions) {
				console.log(json_expressions.value);
			})
			.done(function() {
				console.log( "2st "+$("#expression-table tr").length );
				var update_row = table.insertRow($("#expression-table tr").length);
				var row = table.insertRow(1);
				var cell1 = row.insertCell(0);
				var cell2 = row.insertCell(1);
				var cell3 = row.insertCell(2);
				var update_cell = update_row.insertCell(0);
				cell1.innerHTML = "✗";
				cell2.innerHTML = '<input id="expr" target="_self" type="text" name="watch" size="50" onkeydown="getExpressions()"/>';
				cell3.innerHTML = "";
				update_cell.innerHTML = json_expressions.value;
			});
		}
	}