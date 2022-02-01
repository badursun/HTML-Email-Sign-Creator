jQuery(document).ready(function($) {
	let Template;
	let $Body = $('body');

    $('.telefon').mask('+90 000 000 00 00');
	
    // let Template = Template7.compile( $('#MailTemplate').html() );
	/*
		Download Signature
	*/
	$Body.on('click', '.download-signatura', function(event) {
	    try {
	    	var isFileSaverSupported = !!new Blob();
	    } catch (e) {
			Swal.fire('Attention','Your browser does not allow the Blob operation. Try it in another browser!','error');
	      	return false;
	    };
	    
	    let htmlContent = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>'+ $('#ONIZLEME').html() +'</body></html>';
	    let blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
	    
	    	saveAs(blob, convertToSlug($('#ADSOYAD').val()) + '.html');
	});

	/*
		Data Generator
	*/
	$Body.on('click', '#OLUSTUR', function(event) {
		event.preventDefault();

		if( $('option:selected', $('#THEMES')).val() =='0'){
			Swal.fire('Attention','Select theme first!','error');
			return false;
		};
		if( $('#ADSOYAD').val().length < 2 ){
			Swal.fire('Attention','Write a name','error');
			return false;
		};
		if( $('#TITLE').val().length < 2 ){
			Swal.fire('Attention','Write a title','error');
			return false;
		};
		if( $('#EPOSTA').val().length < 2 ){
			Swal.fire('Attention','Write a email','error');
			return false;
		};
		if( $('#ADRES').val().length < 2 ){
			Swal.fire('Attention','Write a address','error');
			return false;
		};

		$('.download-signatura, #PREVIEW').prop('disabled', true);
		
		$('#ONIZLEME').html('<center><img src="img/loading.svg" class="img-fluid" style="height:100px;" /><h5>Generating...</h5></center>')
		
		let $Data 	= objectifyForm( $('#DATA').serializeArray() );
		let $Domain = $('option:selected', $('#SIRKET')).attr('data-domain');

		let $TemplateData = {
			ADSOYAD 		: $Data.ADSOYAD,
			TITLE 			: $Data.TITLE,
			EPOSTA 			: $Data.EPOSTA,
			MOBIL_TELEFON 	: $Data.CEPTELEFONU,
			SIRKET_TELEFON 	: $Data.TELEFON,
			SIRKET_UNVAN	: $('option:selected', $('#SIRKET')).val(),
			SIRKET_ADRES	: $Data.ADRES,
			SIRKET_LOGO 	: $Data.LOGO,
			DOMAIN 			: $Data.DOMAIN
		}

		setTimeout(function(){
			$('#ONIZLEME').html( Template($TemplateData) );
			$('.download-signatura, #PREVIEW').prop('disabled', false);
		},1500);
	});

	/*
		Preview
	*/
	$Body.on('click', '#PREVIEW', function(event) {
		$('#MODAL_BOX').html( $('#ONIZLEME').html() );
		$('#previewModal').modal('show');
	});

	/*
		Theme Selection
	*/
	$Body.on('change', '#THEMES', function(event) {
		let $ThemeFile = $('option:selected', $('#THEMES')).val();

		if( $ThemeFile =='0'){
			Swal.fire('Attention','Select theme first!','error');
			return false;
		};

		$.get("templates/"+$ThemeFile, function (result) {
		    Template = Template7.compile( result );
			
			let $DummyData = {
				ADSOYAD 		: 'Dr. Lamont Connelly',
				TITLE 			: 'CEO',
				EPOSTA 			: 'reginald09@lemke.biz',
				MOBIL_TELEFON 	: '31896658',
				SIRKET_TELEFON 	: '31896658',
				SIRKET_UNVAN	: 'Emard-DuBuque',
				SIRKET_ADRES	: '90 Yuk Tsai Tsuen, New Territories, Bilzen, 18350',
				SIRKET_LOGO 	: 'https://www.adjans.com.tr/content/themes/adjans_2020/images/adjans-black.svg',
				DOMAIN 			: 'https://fake-address-nonexist.com/'
			};

			$('#ONIZLEME').html( Template($DummyData) );
		},'html');
	});
});


function convertToSlug(Text) {
  return Text.toLowerCase()
             .replace(/[^\w ]+/g, '')
             .replace(/ +/g, '-');
}

function objectifyForm(formArray) {
    //serialize data function
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++){
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}