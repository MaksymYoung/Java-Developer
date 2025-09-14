<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Register Template for Bootstrap</title>

    <!-- Bootstrap core CSS -->
    <link href="/static/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" href="/static/img/favicon.ico">

    <!-- Custom styles for this template -->
    <link rel="stylesheet" href="/static/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
</head>

<body class="text-center">
<form class="form-signin" action="/register" method="post">
    <img class="mb-4" src="https://tinder.com/static/tinder.png" alt="" width="72" height="72">
    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
    <label for="inputLogin" class="sr-only">Login</label>
    <input name="login" type="text" id="inputLogin" class="form-control mb-2" placeholder="Login" required autofocus>
    <label for="inputName" class="sr-only">Full Name</label>
    <input name="name" type="text" id="inputName" class="form-control mb-2" placeholder="Full Name" required autofocus>
    <label for="inputPicture" class="sr-only">Picture</label>
    <input name="picture" type="text" id="inputPicture" class="form-control mb-2" placeholder="Picture" required autofocus>
    <label for="inputPassword" class="sr-only">Password</label>
    <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>
    <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
    <a href="/login" class="btn btn-lg btn-secondary btn-block mt-3">Login</a>
    <p class="mt-5 mb-3 text-muted">${error}</p>
    <p class="mt-5 mb-3 text-muted">&copy; FAKETinder 2018</p>
</form>
</body>
</html>

