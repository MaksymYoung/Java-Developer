<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Like page</title>
    <!-- Bootstrap core CSS -->
    <link href="/static/css/bootstrap.min.css" rel="stylesheet">
    <link rel="icon" href="/static/img/favicon.ico">
    <!-- Font Awesome CSS -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
    <!-- Custom styles for this template -->
    <link rel="stylesheet" href="/static/css/style.css">
    <style>
        .card-body {
            text-align: center;
        }
    </style>
</head>
<body style="background-color: #f5f5f5;">
<div class="col-4 offset-4">
    <div class="card">
        <div class="card-body">
            <div class="link-page-l">
                <a class="link_regLogin-l" href="/liked"><i class="fas fa-heart"></i></a>
            </div>
            <div class="row">
                <div class="col-12 col-lg-12 col-md-12 text-center">
                    <img src="${picture}" alt="" class="mx-auto rounded-circle img-fluid">
                    <h1 class="mb-0 text-truncated">${fullName}</h1>
                    <br>
                </div>
                <div class="col-12 text-center">
                    <form method="post" style="display: inline-block;">
                        <input type="hidden" name="choice" value="Like">
                        <button type="submit" name="Like" value="Like" class="btn btn-outline-success">
                            <span class="fa fa-heart"></span> Like
                        </button>
                    </form>
                    <form method="post" style="display: inline-block; margin-left: 10px;">
                        <input type="hidden" name="choice" value="Dislike">
                        <button type="submit" name="Dislike" value="Dislike" class="btn btn-outline-danger">
                            <span class="fa fa-times"></span> Dislike
                        </button>
                    </form>
                    <div class="navigate-cont">
                        <a class="btn btn-lg btn-light" href="/logout">Logout</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>