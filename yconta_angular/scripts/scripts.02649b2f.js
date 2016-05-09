function extendExceptionHandler($delegate,config,logger){var appErrorPrefix=config.appErrorPrefix,logError=logger.getLogFn("app","error");return function(exception,cause){if($delegate(exception,cause),!appErrorPrefix||0!==exception.message.indexOf(appErrorPrefix)){var errorData={exception:exception,cause:cause},msg=appErrorPrefix+exception.message;logError(msg,errorData,!0)}}}function limitWithRetFilter(){return function(input,limit){return void 0==input?"":input.length>limit?input.slice(0,limit)+"...":input}}$(document).ready(function(){function fix_height(){var heightWithoutNavbar=$("body > #wrapper").height()-61;$(".sidebard-panel").css("min-height",heightWithoutNavbar+"px");var navbarHeigh=$("nav.navbar-default").height(),wrapperHeigh=$("#page-wrapper").height();navbarHeigh>wrapperHeigh&&$("#page-wrapper").css("min-height",navbarHeigh+"px"),wrapperHeigh>navbarHeigh&&$("#page-wrapper").css("min-height",$(window).height()+"px"),$("body").hasClass("fixed-nav")&&(navbarHeigh>wrapperHeigh?$("#page-wrapper").css("min-height",navbarHeigh-60+"px"):$("#page-wrapper").css("min-height",$(window).height()-60+"px"))}$(window).bind("load resize scroll",function(){$("body").hasClass("body-small")||fix_height()}),$(window).scroll(function(){$(window).scrollTop()>0&&!$("body").hasClass("fixed-nav")?$("#right-sidebar").addClass("sidebar-top"):$("#right-sidebar").removeClass("sidebar-top")}),setTimeout(function(){fix_height()})}),$(function(){$(window).bind("load resize",function(){$(document).width()<769?$("body").addClass("body-small"):$("body").removeClass("body-small")})});var app=angular.module("yconta",["ui.router","ui.bootstrap","ngMessages","auth0","angular-storage","angular-jwt","angular-ladda","angularUtils.directives.dirPagination","common","ycontaFilters","ncy-angular-breadcrumb"]);app.run(function($rootScope,$state,auth,store,jwtHelper,$uibModalStack,$uibModal,$location,roleService,sessionService){"use strict";$rootScope.returnToState="",$rootScope.returnToStateParams="",auth.hookEvents(),$rootScope.$on("$locationChangeStart",function(e,next,current){if(!auth.isAuthenticated){var token=store.get("token");token&&(jwtHelper.isTokenExpired(token)?$state.go("login"):(auth.authenticate(store.get("profile"),token),sessionService.usuarioAtual=auth.profile))}roleService.contemRota($location.path(),roleService.adminRoutes)&&!roleService.validateRoleAdmin(sessionService.usuarioAtual)&&(e.preventDefault(),$state.go("401"))}),$rootScope.$on("$stateChangeStart",function(event,toState,toParams,fromState,fromParams,options){$uibModalStack.dismissAll(),toState.data.empresaObrigatoria&&null==sessionService.filtrosContexto.empresaId&&($rootScope.returnToState=toState.name,$rootScope.returnToStateParams=toParams,$uibModal.open({templateUrl:"common/seletor/seletorView.html",windowClass:"inmodal animated bounceInRight",controller:"SeletorController"}).result["finally"](function(){$rootScope.returnToState="",$rootScope.returnToStateParams=""}),event.preventDefault())}),$rootScope.$on("$stateChangeError",function(event,toState,toParams,fromState,fromParams,error){console.log("stateChangeError"),console.log(toState,toParams,fromState,fromParams,error),401==error.status&&(console.log("Opa ! 401 detectado. ¬¬ Redirecionando..."),$state.go("login"))})}),toastr.options.timeOut=1e4,toastr.options.positionClass="toast-top-right",toastr.options.closeButton="true",toastr.options.progressBar="true";var webApiServer="http://localhost/YConta.API/api/",auth0={domain:"yconta.auth0.com",clientID:"LkqVBgcrtDej9Gm0uXrwDU2ZS23s29hZ",loginState:"login"},events={},config={version:"1.0.0",appErrorPrefix:"[YC+ Error] ",events:events,webApiServer:webApiServer,tamanhoPagina:"10"};app.value("config",config),app.config(["$logProvider",function($logProvider){$logProvider.debugEnabled&&$logProvider.debugEnabled(!0)}]),app.config(function(authProvider){authProvider.init(auth0),authProvider.on("loginSuccess",function($location,profilePromise,idToken,store){console.log("Login Success"),profilePromise.then(function(profile){store.set("profile",profile),store.set("token",idToken)})}),authProvider.on("loginFailure",function(){}),authProvider.on("authenticated",function(){})}),app.config(function($httpProvider,jwtInterceptorProvider){jwtInterceptorProvider.tokenGetter=function(store){return store.get("token")},$httpProvider.interceptors.push("jwtInterceptor")}),app.config(function($breadcrumbProvider){$breadcrumbProvider.setOptions({prefixStateName:"index.home"})}),app.config(function($stateProvider,$urlRouterProvider){$urlRouterProvider.otherwise("/"),$stateProvider.state("index",{"abstract":!0,templateUrl:"layout/content.html",data:{requiresLogin:!0,breadcrumbProxy:"index.home"}}).state("index.home",{url:"/",templateUrl:"components/home/homeView.html",data:{pageTitle:"Página Inicial"},ncyBreadcrumb:{label:"Home"}}).state("login",{url:"/login",controller:"LoginController",templateUrl:"common/account/loginView.html",data:{pageTitle:"Login",specialClass:"gray-bg"}}).state("401",{templateUrl:"layout/errorViews/401.html",data:{pageTitle:"Acesso negado",specialClass:"gray-bg"}})}),app.config(["$provide",function($provide){$provide.decorator("$exceptionHandler",["$delegate","config","logger",extendExceptionHandler])}]),app.directive("iboxTools",function($timeout){return{restrict:"A",scope:!0,templateUrl:"layout/ibox/iboxView.html",controller:function($scope,$element,$attrs){var tableSelectorToExport=$attrs.tableselectortoexport?$attrs.tableselectortoexport:".table",ignoreColumns=$attrs.ignorecolumns?$attrs.ignorecolumns:[];$scope.showhide=function(){var ibox=$element.closest("div.ibox"),icon=$element.find("i:last"),content=ibox.find("div.ibox-content");content.slideToggle(200),icon.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),ibox.toggleClass("").toggleClass("border-bottom"),$timeout(function(){ibox.resize(),ibox.find("[id^=map-]").resize()},50)},$scope.closebox=function(){var ibox=$element.closest("div.ibox");ibox.remove()},$scope.printTable=function(){var conteudoTabela=$(tableSelectorToExport)[0].outerHTML;novaJanela=window.open("");var css="<style>body { font-family: 'open sans','Helvetica Neue',Helvetica,Arial,sans-serif; }table { border-collapse: collapse; } table th, table td { font-size: 10px; border: 1px solid #000; padding: 2px; }table th { background-color: #ccc; }table td.naoImprimir, table th.naoImprimir { display:none; } a, a:visited { text-decoration:none; color: #000; }</style>",conteudo="<html><head><title></title>"+css+"</head><body>"+conteudoTabela+"</body>";return novaJanela.document.write(conteudo),novaJanela.print(),novaJanela.close(),!1},$scope.exportToExcel=function(){$(tableSelectorToExport).tableExport({type:"excel",escape:"false",ignoreColumn:ignoreColumns})},$scope.exportToPDF=function(){$(tableSelectorToExport).tableExport({type:"pdf",pdfFontSize:"7",escape:"false",ignoreColumn:ignoreColumns})}}}}),app.directive("iboxToolsFullScreen",function($timeout){return{restrict:"A",scope:!0,templateUrl:"views/common/ibox_tools_full_screen.html",controller:function($scope,$element){$scope.showhide=function(){var ibox=$element.closest("div.ibox"),icon=$element.find("i:first"),content=ibox.find("div.ibox-content");content.slideToggle(200),icon.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),ibox.toggleClass("").toggleClass("border-bottom"),$timeout(function(){ibox.resize(),ibox.find("[id^=map-]").resize()},50)},$scope.closebox=function(){var ibox=$element.closest("div.ibox");ibox.remove()},$scope.fullscreen=function(){var ibox=$element.closest("div.ibox"),button=$element.find("i.fa-expand");$("body").toggleClass("fullscreen-ibox-mode"),button.toggleClass("fa-expand").toggleClass("fa-compress"),ibox.toggleClass("fullscreen"),setTimeout(function(){$(window).trigger("resize")},100)}}}}),app.directive("pageTitle",function($rootScope,$timeout){return{link:function(scope,element){var listener=function(event,toState,toParams,fromState,fromParams){var title="YConta - Gestão em Telecomunicações";toState.data&&toState.data.pageTitle&&(title="YConta - Gestão em Telecomunicações | "+toState.data.pageTitle),$timeout(function(){element.text(title)})};$rootScope.$on("$stateChangeStart",listener)}}}),app.directive("sideNavigation",function($timeout){return{restrict:"A",link:function(scope,element){$timeout(function(){element.metisMenu()})}}}),app.directive("minimalizaSidebar",function($timeout){return{restrict:"A",template:'<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',controller:function($scope,$element){$scope.minimalize=function(){$("body").toggleClass("mini-navbar"),!$("body").hasClass("mini-navbar")||$("body").hasClass("body-small")?($("#side-menu").hide(),setTimeout(function(){$("#side-menu").fadeIn(400)},200)):$("body").hasClass("fixed-sidebar")?($("#side-menu").hide(),setTimeout(function(){$("#side-menu").fadeIn(400)},100)):$("#side-menu").removeAttr("style")}}}}),app.directive("ccScrollToTop",["$window",function($window){function link(scope,element,attrs){function toggleIcon(){$win.scrollTop()>300?element.slideDown():element.slideUp()}var $win=$($window);element.addClass("totop"),$win.scroll(toggleIcon),element.find("a").click(function(e){e.preventDefault(),$("body").animate({scrollTop:0},500)})}var directive={link:link,template:'<a href="#"><i class="fa fa-chevron-up"></i></a>',restrict:"A"};return directive}]),angular.module("ycontaFilters",[]).filter("limitWithRet",limitWithRetFilter),function(){"use strict";function common($q,$rootScope,$timeout,logger){function $broadcast(){return $rootScope.$broadcast.apply($rootScope,arguments)}function isNumber(val){return/^[-]?\d+$/.test(val)}function textContains(text,searchText){return text&&-1!==text.toLowerCase().indexOf(searchText.toLowerCase())}var service={$broadcast:$broadcast,$q:$q,$timeout:$timeout,isNumber:isNumber,logger:logger,textContains:textContains};return service}var commonModule=angular.module("common",[]);commonModule.factory("common",["$q","$rootScope","$timeout","logger",common])}(),function(){"use strict";function logger($log){function getLogFn(moduleId,fnName){switch(fnName=fnName||"log",fnName.toLowerCase()){case"success":fnName="logSuccess";break;case"error":fnName="logError";break;case"warn":fnName="logWarning";break;case"warning":fnName="logWarning"}var logFn=service[fnName]||service.log;return function(msg,data,showToast){logFn(msg,data,moduleId,void 0===showToast?!0:showToast)}}function log(message,data,source,showToast){logIt(message,data,source,showToast,"info")}function logWarning(message,data,source){logIt(message,data,source,!0,"warning")}function logSuccess(message,data,source){logIt(message,data,source,!0,"success")}function logError(message,data,source){logIt(message,data,source,!0,"error")}function logIt(message,data,source,showToast,toastType){var write="error"===toastType?$log.error:$log.log;source=source?"["+source+"] ":"",write(source,message,data),showToast&&("error"===toastType?toastr.error(message,"Ops ! Ocorreu um erro na aplicação.",{timeOut:"0",positionClass:"toast-bottom-full-width"}):"warning"===toastType?toastr.warning(message):"success"===toastType?toastr.success(message):toastr.info(message))}var service={getLogFn:getLogFn,log:log,logError:logError,logSuccess:logSuccess,logWarning:logWarning};return service}angular.module("common").factory("logger",["$log",logger])}(),app.factory("authenticationService",function($q,auth,store,sessionService){"use strict";return{login:function(loginData){return $q(function(resolve,reject){auth.signin({username:loginData.userName,password:loginData.password,connection:"Username-Password-Authentication",sso:!1,authParams:{scope:"openid app_metadata user_metadata name email"}},function(profile,idToken,accessToken,state,refreshToken){sessionService.usuarioAtual=auth.profile,resolve(profile,idToken,accessToken,state,refreshToken)},function(error){reject(error.details.error_description)},"Auth0")})},logoff:function(){return $q(function(resolve,reject){auth.signout(),store.remove("profile"),store.remove("token"),sessionService.limparFiltrosDeContexto(),resolve()})},isLoggedIn:function(){return auth.isAuthenticated}}}),app.factory("roleService",function(){"use strict";var adminRoles=["Administrador","editor"],otherRoles=["Usuario"],adminRoutes=["/centroCusto"];return{adminRoutes:adminRoutes,validateRoleAdmin:function(usuarioAtual){var isValid=!1;return null!=usuarioAtual&&void 0!=usuarioAtual||(isValid=!1),$.grep(adminRoles,function(v,i){return $.inArray(v,usuarioAtual.roles)>=0?void(isValid=!0):void 0}),isValid},validateRoleOther:function(usuarioAtual){return usuarioAtual?$.contains(otherRoles,usuarioAtual.roles):!1},contemRota:function(rota,listaRotas){var contem=!1;return $(listaRotas).each(function(i){return null!=rota.match("^"+this)?void(contem=!0):void 0}),contem}}}),app.factory("sessionService",["store",function(store){"use strict";var filtrosContextoPadrao={empresaId:null,centroCustos:[],contas:[]};return{usuarioAtual:null,filtrosContexto:null==store.get("filtrosContexto")?$.extend({},filtrosContextoPadrao):store.get("filtrosContexto"),setFiltrosDeContexto:function(filtrosContexto){return this.filtrosContexto=filtrosContexto,store.set("filtrosContexto",filtrosContexto)},limparFiltrosDeContexto:function(){return this.filtrosContexto=$.extend({},filtrosContextoPadrao),store.set("filtrosContexto",this.filtrosContexto)}}}]),app.service("queryStringService",function($location){this.obterFiltros=function(filterObj){var qs=$location.search();for(var param in filterObj)param in qs&&(filterObj[param]=qs[param]);return filterObj},this.atualizarFiltros=function(filterObj){var novaQueryString={};for(var param in filterObj)""!=filterObj[param]&&(novaQueryString[param]=filterObj[param]);$location.search(novaQueryString)}}),app.directive("backButton",function(){return{restrict:"A",link:function(scope,element,attrs){function goBack(){history.back(),scope.$apply()}element.bind("click",goBack)}}}),app.directive("seletor",function($uibModal){return{restrict:"A",scope:!0,template:'<span class="btn btn-primary" ng-click="abrirSeletor()"><i class="fa fa-exchange"></i> {{ nomeEmpresa }}</span>',controller:function($scope,$element,$attrs){$scope.nomeEmpresa="Selecionar empresa",$scope.abrirSeletor=function(){var modalInstance=$uibModal.open({templateUrl:"common/seletor/seletorView.html",windowClass:"inmodal animated bounceInRight",controller:"SeletorController"});modalInstance.rendered.then(function(){$("#select-empresa").multipleSelect({filter:!0,noMatchesFound:"Nenhum registro encontrado",selectAllText:" Selecionar todas ",allSelected:"[Todas as Contas]",countSelected:"# de % selecionadas"})}),modalInstance.result["finally"](function(){$rootScope.returnToState="",$rootScope.returnToStateParams=""}),modalInstance.result.then(function(selectedItem){$scope.nomeEmpresa=selectedItem},function(){})}}}}),app.controller("SeletorController",function($scope,$rootScope,$state,$uibModalInstance,common,sessionService){"use strict";$scope.fechar=function(){$uibModalInstance.dismiss()},$scope.selecionar=function(){var filtro=sessionService.filtrosContexto;filtro.empresaId=1,sessionService.setFiltrosDeContexto(filtro),$rootScope.returnToState&&$state.go($rootScope.returnToState,$rootScope.returnToStateParams),$uibModalInstance.close({teste:"123"})}}),app.controller("LoginController",function($scope,$location,authenticationService){$scope.loadingData=!1,$scope.loginData={userName:"",password:""},$scope.message="",$scope.login=function(isValid){isValid&&($scope.loadingData=!0,authenticationService.login($scope.loginData).then(function(profile,idToken,accessToken,state,refreshToken){$location.path("/"),$scope.loadingData=!1},function(errorMsg){$scope.message=errorMsg,$scope.loadingData=!1}))}});var controllerId="MainController";app.controller(controllerId,function($scope,$state,common,authenticationService,sessionService){$scope.$state=$state,this.helloText="Welcome in SeedProject",this.descriptionText="It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.",$scope.logOut=function(){console.log("Saindo: "+sessionService.usuarioAtual.nickname),authenticationService.logoff().then(function(){$state.go("login")})}}),app.config(function($stateProvider,$urlRouterProvider){$stateProvider.state("centroCusto",{"abstract":!0,templateUrl:"layout/content.html",data:{pageTitle:"Centro de Custos",requiresLogin:!0}}).state("centroCusto.lista",{url:"/centroCusto?paginaAtual&tamanhoPagina",resolve:{centroCusto:function(){return{}}},controller:"CentroCustoController",templateUrl:"components/centroCusto/lista.html",params:{paginaAtual:{value:"1"},tamanhoPagina:{value:config.tamanhoPagina}},reloadOnSearch:!1,data:{pageTitle:"Centro de Custos",empresaObrigatoria:!0},ncyBreadcrumb:{label:"Centro de Custos"}}).state("centroCusto.lista.editar",{url:"/editar/:id",onEnter:function($uibModal,$state,$stateParams,centroCustoService){$uibModal.open({templateUrl:"components/centroCusto/form-modal.html",windowClass:"animated bounceIn",resolve:{centroCusto:function(){return centroCustoService.obter($stateParams.id)}},controller:"CentroCustoController"}).result["finally"](function(){$state.go("centroCusto.lista")})},onExit:function(){}}).state("centroCusto.criar",{url:"/centroCusto/criar",resolve:{centroCusto:function(){return{}}},controller:"CentroCustoController",templateUrl:"components/centroCusto/form.html",data:{pageTitle:"Centro de Custos",empresaObrigatoria:!0},ncyBreadcrumb:{label:"Novo",parent:"centroCusto.lista"}}).state("centroCusto.editar",{url:"/centroCusto/:id",controller:"CentroCustoController",templateUrl:"components/centroCusto/form.html",data:{pageTitle:"Centro de Custos",empresaObrigatoria:!0},resolve:{centroCusto:function($stateParams,centroCustoService){return centroCustoService.obter($stateParams.id)}},ncyBreadcrumb:{label:"{{ centroCusto.nome | limitWithRet:20 }}",parent:"centroCusto.lista"}})}),app.controller("CentroCustoController",function($scope,$state,$stateParams,common,sessionService,centroCustoService,queryStringService,centroCusto){$scope.centroCusto=centroCusto.data,$scope.totalRegistros=0,$scope.carregando=!1;var filtros={paginaAtual:"",tamanhoPagina:config.tamanhoPagina,id:"",nome:""};$scope.filtros=queryStringService.obterFiltros(filtros);var pesquisar=function(paginaAtual){centroCustoService.pesquisar($.extend({},$scope.filtros,sessionService.filtrosContexto)).then(function(results){$scope.centrosCustos=results.data.entidades,$scope.totalRegistros=results.data.totalRegistros,$scope.filtros.paginaAtual=paginaAtual});queryStringService.atualizarFiltros($scope.filtros)};$scope.pesquisar=pesquisar,"centroCusto.lista"==$state.current.name&&$scope.pesquisar($scope.filtros.paginaAtual),$scope.salvar=function(isValid){$scope.carregando=!0,isValid&&centroCustoService.salvar($scope.centroCusto).then(function(results){common.logger.logSuccess("Registro salvo com sucesso!"),$scope.carregando=!1},function(error){common.logger.logError(error.data.exceptionMessage,error.data),$scope.carregando=!1})},$scope.deletar=function(centroCusto){swal({title:"Tem certeza?",text:"Você irá deletar esse registro e não poderá recuperá-lo depois.",type:"warning",showCancelButton:!0,confirmButtonText:"Sim",cancelButtonText:"Não",closeOnConfirm:!1,showLoaderOnConfirm:!0},function(isConfirm){isConfirm&&centroCustoService.deletar(centroCusto.id).then(function(results){pesquisar($scope.filtros.paginaAtual),swal.close()})})}}),app.factory("centroCustoService",function($http,config,sessionService){var serviceBase=config.webApiServer,centroCustoServiceFactory={};return centroCustoServiceFactory.pesquisar=function(filtros){return $http.get(serviceBase+"centroCusto?"+$.param(filtros))},centroCustoServiceFactory.obterTodos=function(){return $http.get(serviceBase+"centroCusto").then(function(results){return results})},centroCustoServiceFactory.obter=function(id){return $http.get(serviceBase+"centroCusto/"+id).then(function(results){return results})},centroCustoServiceFactory.salvar=function(centroCusto){return centroCusto.id?$http.put(serviceBase+"centroCusto/"+centroCusto.id,centroCusto):(centroCusto.empresaId=sessionService.filtrosContexto.empresaId,$http.post(serviceBase+"centroCusto",centroCusto))},centroCustoServiceFactory.deletar=function(id){return $http["delete"](serviceBase+"centroCusto/"+id)},centroCustoServiceFactory});