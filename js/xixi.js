require(["esri/config",
            "esri/Map",
            "esri/views/MapView",
			"esri/layers/GeoJSONLayer",
			"esri/layers/FeatureLayer",
			"esri/Graphic",
			"esri/geometry/geometryEngine",
			"esri/geometry/Point",
			"esri/core/watchUtils",
			"esri/widgets/Legend",
			"esri/layers/GraphicsLayer",
			"esri/WebMap",
			"esri/widgets/Expand",
			"esri/views/layers/LayerView",
			"esri/views/layers/support/FeatureEffect"], function (esriConfig, Map, MapView,GeoJSONLayer,FLayer,Graphic,geometryEngine,Point,watchUtils,Legend,GraphicsLayer,WebMap,Expand,LayerView,FeatureEffect) {

                esriConfig.apiKey = "AAPK56e3ac027f044c4089d8ceec232fc05dYaOuzVRzm8tMRqvzOvDvIEevbqJ85yppn9PacU6cy4duurJrVK9wo_8BcWO8i8bi";

				const symbol_1={
					type:"simple-fill",
					outline:{
						color:[128,128,128,0.5],
						width:"0.5px"
					}
				};

				const render_Temp={
					type:"simple",
					symbol:symbol_1,
					label:"1998-2018年平均气温",
					visualVariables:[
						{
							type:"color",
							field:"allTemp",
							legendOptions: {
							  title: "摄氏度℃"
							},
							stops:[
								{
									value:5.5,
									color: "#BFEFFF",
									label:"<5.5℃"
								},
								{
									value:25.9,
									color: "#EE7621",
									label:">25.9℃"
								}
							],
						}
					],
				};

				const webmap_xixi=new WebMap({
					portalItem: {
					      id: "ad5759bf407c4554b748356ebe1886e5"
					}
				});
				
				const view = new MapView({
				    map: webmap_xixi,
				    center: [108, 35.027],
				    zoom: 3,
					scale:30000000,
				    container: "mapdiv_xixi"
				});
				
				const China_xixi=new GeoJSONLayer({
					url:"https://YueyueXixi.github.io/temp_prec.json",
					renderer:render_Temp,
					title:"图例",
					popupTemplate:{
						title:"{ENGLISH},{PROV}",
						content:"1998-2008年平均气温为{allTemp}℃,年平均降水量为{allPrec}mm",
						fieldInfos:[
							{
								fieldName:"allTemp",
								format:{
									digitSeparator: true,
									places: 0
								}
							},
							{
								fieldName:"allPrec",
								format:{
									digitSeparator: true,
									places: 0
								}
							}
						]
					}
				});
				view.map.add(China_xixi);
				
				let highlightSelect;
				view.whenLayerView(China_xixi).then((layerView) => {
				  document.getElementById("data").onclick = function() {queryTemp()};
				  function queryTemp() {
				  	const num=document.getElementById("temp_xixi").value;
				  	const queryTemp = China_xixi.createQuery();
				  	queryTemp.where = `allTemp<'${num}'`;
				  	China_xixi.queryFeatures(queryTemp).then((result) => {
						if (highlightSelect) {
							highlightSelect.remove()
						};
				  	  result.features.forEach(function(item){
				  		highlightSelect=layerView.highlight(item.attributes["OBJECTID"]);
				  	  });
				  	});
				  };
				});
				
				const query_expand=new Expand({
					view: view,
					expanded:true,
					expandIconClass:"esri-icon-partly-cloudy",
					content:class_expand
				});
				view.ui.add(query_expand,"top-left");
				
				const leg_temp=new Legend({
					view:view,
					 layerInfos:[{
						 layer:China_xixi
					 }]
				});
				view.ui.add(leg_temp,"top-right");
				
				let query=China_xixi.createQuery();
				query.geometry=view.toMap();
				query.returnGeometry=true;
				query.where="allPrec<600";
				query.outFields=["*"];
				China_xixi.queryFeatures(query).then(function(obj){
							obj.features.forEach(function(item){
								var prec=new Graphic({
									geometry:item.geometry.centroid,
									symbol:{
										type:"simple-marker",
										color:"blue",
										size: 6,
										outline: {
										    width: 0.5,
										    color: "white"}
									}
								});
								view.graphics.add(prec)
							});
				});
				
				let query_2=China_xixi.createQuery();
				query_2.geometry=view.toMap();
				query_2.returnGeometry=true;
				query_2.where="allPrec>600 AND allPrec<1400";
				query_2.outFields=["*"];
				China_xixi.queryFeatures(query_2).then(function(obj){
							obj.features.forEach(function(item){
								var prec=new Graphic({
									geometry:item.geometry.centroid,
									symbol:{
										type:"simple-marker",
										color:"blue",
										size: 11,
										outline: {
										    width: 1.5,
										    color: "white"}
									}
								});
								view.graphics.add(prec)
							});
				});
				
				let query_3=China_xixi.createQuery();
				query_3.geometry=view.toMap();
				query_3.returnGeometry=true;
				query_3.where="allPrec>1400";
				query_3.outFields=["*"];
				China_xixi.queryFeatures(query_3).then(function(obj){
							obj.features.forEach(function(item){
								var prec=new Graphic({
									geometry:item.geometry.centroid,
									symbol:{
										type:"simple-marker",
										color:"blue",
										size: 16,
										outline: {
										    width: 2.0,
										    color: "white"}
									}
								});
								view.graphics.add(prec)
							});
				});
				
				let layerview_xixi,animation_xixi;
				const countryGraphicsLayer = new GraphicsLayer({
				    blendMode: "destination-in",
				    effect: "bloom(200%)"
				});
				
				view.map.loadAll().then(async () => {
					addWorld();
					view.map.basemap.baseLayers.add(countryGraphicsLayer);
					layerView_xixi = await view.whenLayerView(China_xixi);
				});
				
				const symbol_sf = {
				        type: "simple-fill",
				        color: "white",
				        outline: null
				};
				
				view.on("click", async (event) => {
					const {
					          features: [feature]
					        } = await layerView_xixi.queryFeatures({
					          geometry: view.toMap(event),
					          returnGeometry: true,
					          maxAllowableOffset: 10000,
					          outFields: ["*"]
					});
					countryGraphicsLayer.graphics.removeAll();
					animation_xixi && animation_xixi.remove();
					let world = addWorld();
					if (feature) {
					    feature.symbol = symbol_sf;
					    countryGraphicsLayer.graphics.add(feature);
					    animation_xixi = fadeWorld(world);
					    view.goTo({
					              target: view.toMap(event),
					              extent: feature.geometry.extent.clone().expand(1.8)
					            },
					            { duration: 1000 }
					    );
					}
				});
				
				function addWorld(world) {
				    world = new Graphic({
				        geometry: {
				            type: "extent",
				            xmin: -180,
				            xmax: 180,
				            ymin: -90,
				            ymax: 90
				        },
				        symbol: {
							type: "simple-fill",
				            color: "rgba(0, 0, 0, 1)",
				            outline: null
				        }
				        });
				        countryGraphicsLayer.graphics.add(world);
				        return world;
				};
				
				function fadeWorld(world) {
				    let timer;
				    function frame() {
				        const symbol = world.symbol.clone();
				        symbol.color.a = Math.max(0, symbol.color.a - 0.1);
				        world.symbol = symbol;
				        if (symbol.color.a > 0) {
				            timer = requestAnimationFrame(frame);
				        }
				        }
				        frame();
				        return {
				          remove() {
				            cancelAnimationFrame(timer);
				          }
				        };
				};
        });