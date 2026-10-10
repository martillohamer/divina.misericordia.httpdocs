jQuery(document).ready(function () {
	GLOBAL_loginManager.callmeWhenReady(updateDataAndTrackIt);
});

function updateDataAndTrackIt(data)
{
	if(data.isLogged())
		trk_ext.trkC_bill = data.billingData.billingCode;

	trk_dada.init();
	trk_math.init();
}