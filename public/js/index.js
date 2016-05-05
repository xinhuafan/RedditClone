(function(){

    //$.getScript("user_panel.js", function(){

        //alert("Script loaded but not necessarily executed.");

    //});

    //$.getScript("login_panel.js", function(){

        //alert("Script loaded but not necessarily executed.");

    //});

    //$.getScript("showcase.js", function(){

        //alert("Script loaded but not necessarily executed.");

    //});
    $("button#login").click(function(){
        console.log("login!");
        $("section.fullpage_cover").toggle();
    })


})()


$("button#login").click(function(){
    console.log("login!");
    $("section.fullpage_cover").toggle();
})