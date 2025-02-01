<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the form data
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Set your email address where messages will be sent
    $to = "your-email@example.com"; 
    $subject = "New message from Portfolio contact form";
    
    // Create the email content
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    
    // Send the email
    if (mail($to, $subject, $body)) {
        echo "Message sent successfully!";
    } else {
        echo "Sorry, something went wrong. Please try again.";
    }
}
?>
