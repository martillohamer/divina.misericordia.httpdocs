// Cloudy Theme JS File
// _______________________________________________________

jQuery(function() {
	// plane banner for search
    jQuery("#open-search").click( function() {
	if (jQuery("#openCloseIdentifier").is(":hidden")) {
		jQuery(".header-search-box").animate({"left": "2500px"}, "slow", function() {
			jQuery(".header-search-box").css("display","none");
			jQuery(".header-search-box").css("left","-2500px");
		});
		jQuery("#openCloseIdentifier").show();
	} else {
		jQuery(".header-search-box").css("display","block");
		jQuery(".header-search-box").animate({"left": "400px"}, "slow", function() {
			//jQuery(".header-search-box").css("z-index",99);
		});
		jQuery("#openCloseIdentifier").hide();
	}
    }); 
});