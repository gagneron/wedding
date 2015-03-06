<?php

if ($_POST['sent'] == 'sent') {
    $to = 'liz.rudy.wedding@gmail.com';
    $subject = 'Bridesmaid candidate ' . $_POST['name'] . ' has said ' . $_POST['choice'];
    $message = $_POST['comment'];
 
    mail($to, $subject, $message); //This method sends the mail.
    echo "Your email was sent!"; // success message
}

?>