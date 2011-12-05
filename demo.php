<?php
// this file is not required for functionality, just a demonstration

	$option = ($_GET['myOption']) ? $_GET['myOption'] : $_POST['myOption'];
	$number = ($_GET['myNumber']) ? $_GET['myNumber'] : $_POST['myNumber'];
	
	if( $option == "demo4"){
		echo "Hey that's cool.  You passed in some custom variables with that ajax call";
	}else if ($option == "demo5"){
		if ($number == "69"){ 
			echo "Only perverts love the number 69";
		}
		else{
			echo "Your number " . $number . " is being use to seed a random number generator which produced: ";
		}
	}else{
		echo "No options were passed, so we can just display some text here";
		}

?>