<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
    <title>MajorkaRP ADMIN</title>
    <link rel="icon" href="{{ asset('imgs/logo3.png') }}">
    @vite('resources/react/app.tsx')
</head>
<body>
    <div id="app" data-players="{{ json_encode($players) }}" data-bans = "{{json_encode($bans)}}"></div>
</body>
</html>
