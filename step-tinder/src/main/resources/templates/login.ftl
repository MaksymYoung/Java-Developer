<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Signin Template for Bootstrap</title>

    <!-- Bootstrap core CSS -->
    <link href="/static/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" href="/static/img/favicon.ico">

    <!-- Custom styles for this template -->
    <link rel="stylesheet" href="/static/css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
</head>

<body class="text-center">
    <form class="form-signin" action="/login" method="post">
        <img class="mb-4" src="https://tinder.com/static/tinder.png" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label for="inputEmail" class="sr-only">Login</label>
        <input name="login" type="text" id="inputEmail" class="form-control mb-2" placeholder="Login" required autofocus>
        <label for="inputPassword" class="sr-only">Password</label>
        <input type="password" name="password" id="inputPassword" class="form-control" placeholder="Password" required>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            <a href="/register" class="btn btn-lg btn-secondary btn-block mt-3">Register</a>
        <p class="mt-5 mb-3 text-muted">${error}</p>
        <p class="mt-5 mb-3 text-muted">&copy; FAKETinder 2018</p>
    </form>
</body>
</html>