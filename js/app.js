$(document).ready(function(){

document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady()
{

	//check local storage for channel
	if(localStorage.channel==null|| localStorage.channel=='')
	{
		$('#popupDialog').popup("open");
	}
	else
	{
		var channel=localStorage.getItem('channel');
	}

    //var channel='UCCXI1enH8V8X2ppUYeJHF2g';
    getplaylist(channel);

    $(document).on('click','#vidlist li',function(){
    	showVideo($(this).attr('videoid'));
    });

    $('#channelBtnOk').click(function(){
    	var channel=$('#channelName').val();
    	setChannel(channel);
    	getplaylist(channel);
    });

    $('#saveOptions').click(function(){

    	saveOptions();
    });

    $('#clearChannel').click(function(){
    	clearChannel();
    });

    $(document).on('pageinit','#options',function(e){
    	var channel=localStorage.getItem('channel');
    	var maxResults=localStorage.getItem('maxresults');
    	$('#channelNameOption').attr('value',channel);
    	$('#maxResultsOptions').attr('value',maxResults);
    });

}

function getplaylist(channel){
$('#vidlist').html('');
$.get(
		"https://www.googleapis.com/youtube/v3/channels",
		{
			part:'contentDetails',
			id:channel,
			key:'AIzaSyBDixQ0UiYhb-f6mJjYZqdhhYFScVfRmrc'
		},
		function(data)
		{
			$.each(data.items,function(i,item){

				console.log(item);
				playlistId=item.contentDetails.relatedPlaylists.uploads;
				getVideos(playlistId,10);
			});
		}
	)
}

function getVideos(playlistId,maxResults)
{
	$.get(
			"https://www.googleapis.com/youtube/v3/playlistItems",
			{
				part:'snippet',
				maxResults:maxResults,
				playlistId:playlistId,
				key:'AIzaSyBDixQ0UiYhb-f6mJjYZqdhhYFScVfRmrc'
			},
			function(data)
			{
				var output;
				$.each(data.items,function(i,item){
					id=item.snippet.resourceId.videoId;
					title=item.snippet.title;
					thumb=item.snippet.thumbnails.default.url;
					$('#vidlist').append('<li videoId="'+id+'"><img src="'+thumb+'"><h3>'+title+'</h3><li>');
					$('#vidlist').listview('refresh');
				});
			}
		);
}

function showVideo(id)
{
	console.log('Showing Video '+id);
	$('#logo').hide();
	var output='<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+id+'" frameborder="0" allowfullscreen></iframe>';
	$('#showvideo').html(output);
}

function setChannel(channel){
	localStorage.setItem('channel',channel);
	console.log('Channel Set'+channel);
}

function setMaxResults(maxResults){
	localStorage.setItem('maxresults',maxResults);
	console.log('Max Results Changed '+maxResults);
}

function saveOptions()
{
	var channel=$('#channelNameOption').val();
	setChannel(channel);
	var maxResults=$('#maxResultsOptions').val();
	setMaxResults(maxResults);
	$('body').pagecontainer('change','#main',{options});
	getplaylist(channel);
}

function clearChannel()
{
	localStorage.removeItem('channel');
	$('body').pagecontainer('change','#main',{options});
	//Cleare List
	$('#vidlist').html('');
	//Show Popup
	$('#popupDialog').popup('open');
}