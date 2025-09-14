<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liked Users</title>
    <link rel="icon" href="/static/img/favicon.ico">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
    <link href="/static/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/static/css/style.css">
    <style>
        .avatar-img {
            width: 100px;
            height: 100px;
            overflow: hidden;
            border-radius: 50%;
            margin-right: 10px;
            align-self: center;
        }
        .avatar-img img {
            width: 100%;
            height: auto;
            align-self: center;
        }
        .btn-chat {
            width: 80px;
            margin-top: 10px;
            align-self: center;
        }
        .card-header {
            background-color: blue;
            color: white;
            display: inline-block;
            padding-left: 10px;
            padding-right: 10px;
            width: 1.2 * auto;
            align-self: center;
        }
    </style>
</head>
<body style="background-color: #f5f5f5;">

<div class="container" align="center">
    <div class="row mt-5 justify-content-center">
        <div class="col-8">
            <div class="card">
                <div class="card-header">
                    <h1 class="card-title text-center">Liked Users</h1>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <tbody>
                            <#list users as user>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <div class="avatar-img">
                                                <img class="img-circle" src="${user.picture}" alt="${user.username}">
                                            </div>
                                            <div>
                                                <span>${user.fullName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <a href="/messages/${user.id}" class="btn btn-primary btn-chat">Chat</a>
                                    </td>
                                </tr>
                            </#list>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="navigate-cont">
                    <a class="btn btn-lg btn-light" href="/logout">Logout</a>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>