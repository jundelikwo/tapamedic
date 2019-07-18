<!doctype html>
<html>
	<head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
	</head>
	
	<body>
		<script src="https://js.paystack.co/v1/inline.js"></script>
		<div id="paystackEmbedContainer"></div>

		<script>
			var handler = PaystackPop.setup({
				key: 'pk_live_8f5d759ceb04af5d1771705153987dd5c8097196',
				email: '{{ $email }}',
				amount: {{ $amount }},
				metadata: {
					custom_fields: [
						{
							display_name: "Trip",
							variable_name: "trip",
							value: {{ $id }}
						}
					]
				},
				callback: function(response){
						console.log('id: {{ $id }}, transaction ref is ' + response.reference);
						fetch('/payment/{{ $id }}/verify/'+response.reference);
						try{
							window.sendMessage;
							window.ReactNativeWebView.postMessage('/payment/{{ $id }}/verify/'+response.reference)
		                    window.postMessage('/payment/{{ $id }}/verify/'+response.reference)
						} catch(e){
						    
						}
					},
			});
			handler.openIframe();
		</script>
	</body>
</html>