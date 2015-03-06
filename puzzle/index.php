<!DOCTYPE html>
<html>
<head>
    <title>puzzle</title>
    <link rel="stylesheet" type="text/css" href="../css/puzzle.css">
</head>
<!-- <body oncontextmenu="return false;"> -->
<body>
    <div class="bubble">
        Solve the<br/>
        puzzle! 
    </div>
    <div class="victory">
<!--         <iframe src="https://docs.google.com/forms/d/1A4YthLMqZ-Tviv0UoiZaAoIa7M7YHXY4cvmdgf6Gw8c/viewform?embedded=true" width="760" height="1000" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe> -->
        <header></header>
        <h1>Will you be my bridesmaid?</h1>
        <form method="post" action="email.php">
            <label><input type="radio" name="choice" value="yes"><span>Yes!</span></label>
            <label><input type="radio" name="choice" value="yesyes"><span>Yes! Yes! A million times yes!</span></label>
            <label><input type="radio" name="choice" value="no"><span>No&nbsp;&nbsp;:(</span></label>
            <input type="hidden" name="name" value="Pika">
            <label class="textArea">
                Leave a comment, if you wish:
                <textarea name="comment" id="comment"></textarea>
            </label>
            <button type="submit" name="send" value="send">Submit</button>
        </form>

    </div>
    <div id="congrats">Congratulations!</div>
    <div id="puzzle">   
  
    </div>
    <table id="grid"></table>       
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript" src="../js/puzzle.js"></script>
</body>
</html>