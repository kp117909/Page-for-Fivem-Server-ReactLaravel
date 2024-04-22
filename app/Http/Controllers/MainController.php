<?php

namespace App\Http\Controllers;

use App\Http\Controllers\PlayerController;
use App\Http\Controllers\BanListController;

class MainController extends Controller
{
      /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function login()
    {
        return view('auth.login');
    }


    public function index()
    {
        $playerController = new PlayerController();
        $banListController = new BanListController();

        $players = $playerController->list();
        $bans = $banListController->getBanList();

        return view('players.index', [
            'players' => $players,
            'bans' => $bans,
        ]);
    }

}
