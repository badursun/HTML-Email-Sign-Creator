jQuery(document).ready(function($) {
	let Template;
	let $Body = $('body');

    $('.telefon').mask('+90 000 000 00 00');
	
    // let Template = Template7.compile( $('#MailTemplate').html() );
	$.get("../templates/template-1.html", function (result) {
	     console.log( result )
	     Template = Template7.compile( result );
	     console.log( Template )
	},'html');


	$Body.on('click', '.download-signatura', function(event) {
	    try {
	    	var isFileSaverSupported = !!new Blob();
	    } catch (e) {
			Swal.fire('Attention','Your browser does not allow the Blob operation. Try it in another browser!','error');
	      	return false;
	    };
	    
	    let FileName = ''+ $('#ADSOYAD').val();
	    let htmlContent = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>'+ $('#ONIZLEME').html() +'</body></html>';
	    let blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
	    
	    	saveAs(blob, convertToSlug(FileName)+'.html');
	});

	$Body.on('click', '#OLUSTUR', function(event) {
		event.preventDefault();

		$('.download-signatura, #PREVIEW').prop('disabled', true);
		$('#ONIZLEME').html('<center><img src="img/loading.svg" class="img-fluid" style="height:100px;" /><h5>Generating...</h5></center>')
		
		let $Data 	= objectifyForm( $('#DATA').serializeArray() );
		let $Sirket = $('option:selected', $('#SIRKET'));
		let $Host 	= $('#HOST').val();
		let $Domain = $('option:selected', $('#SIRKET')).attr('data-domain');

		let $TemplateData = {
			ADSOYAD 		: $Data.ADSOYAD,
			TITLE 			: $Data.TITLE,
			EPOSTA 			: ($Data.EPOSTA.length>1 ? $Data.EPOSTA + '@' + $Domain : ''),
			ADRES 			: $Data.ADRES,
			MOBIL_TELEFON 	: $Data.CEPTELEFONU,
			SIRKET_TELEFON 	: $Data.TELEFON,
			SIRKET_UNVAN	: $Sirket.val(),
			SIRKET_ADRES	: $('#ADRES').val(),
			SIRKET_LOGO 	: $('#LOGO').val(),
			QR_CODE 		: '',
			DOMAIN 			: $Sirket.attr('data-domain')
		}
		console.log($TemplateData);
		setTimeout(function(){
			$('#ONIZLEME').html( Template($TemplateData) );
			$('.download-signatura, #PREVIEW').prop('disabled', false);
		},1500);
	});

	$Body.on('click', '#PREVIEW', function(event) {
		$('#MODAL_BOX').html( $('#ONIZLEME').html() );
		$('#previewModal').modal('show');
	});

	$Body.on('keyup', '#LOGO', function(event) {
		event.preventDefault();
		let $Logo = $(this).val();

		$('#MAIN_LOGO').attr('src', $Logo);
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