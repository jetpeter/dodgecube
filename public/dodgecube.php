<!DOCTYPE HTML>
<html>
<head>
    <title>Dodge Cube</title>
    <link rel="stylesheet" href="css/dodgecube.css">
    <link rel="stylesheet" href="css/counter.css">
    <!-- Load Jquery -->
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="js/flipcounter.min.js"></script>
    <script src="js/Keys.js"></script>
    <script src="js/Ship.js"></script>
    <script src="js/Missile.js"></script> 
    <script src="js/Target.js"></script>
</head>
<body>
    <div class="game">
        <div id="dodgecube" class="left">
            <div id="menu">
                <div id="status" class="text title">
                    Dodgecube
                </div>
                <input id="player_name" placeholder="Enter username" type="text" maxlength="15"></input>
                <div id="new_game" class="text button positive padded">
                    launch
                </div>
            </div>
            <canvas id="canvas" width="540" height="400"></canvas>
            <div class="score_field">
                <div id="score" class="flip-counter score padded"></div>
                <div class="text padded">score</div>
            </div>
        </div>
        <div class="left">
            <div class="scores text">
                <div class="header"> High Scores </div>
                <table class="score_list">
                <?php
                    include '../sql_config.php';
                    $ipaddress = $_SERVER["REMOTE_ADDR"];
                    if (is_null($ipaddress)) {
                        $ipaddress = '192.168.1.100';
                    }
                    $mysqli = new mysqli(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB);
                    if ($mysqli->connect_errno) {
                        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
                    }

                    $result = $mysqli->query('SELECT score, name FROM scores WHERE score < 700 OR ipaddress LIKE "' . $ipaddress . '" ORDER BY score DESC LIMIT 10');
                    $index = 1;
                    while ($row = mysqli_fetch_array($result)) {
                        echo '<tr class"score_row text">';
                        echo '<td class="rank">' . $index . '.)</td>';
                        echo '<td class="high_score"> ' . $row['score'] . '</td>';
                        echo '<td class="player_name">' . $row['name'] . '</td>';
                        echo '</tr>';
                        $index++;
                    }   
                ?>
                </table>
            </div>
            <div class="text"> Shift + s to enable sound </div>
        </div>
    </div>

</body>
    <script src="js/dodgecube.js"></script>
</html>
