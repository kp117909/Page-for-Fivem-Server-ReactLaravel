<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BanListHistory;
use Illuminate\Http\Request;

class BanHistoryListController extends Controller
{
    public function list()
    {
        $banList = $this->getBanList();

        return $banList;
    }

    public function get(Request $request)
    {
        $identifier = $request->identifier;
        $ban = BanListHistory::where('identifier', $identifier)->first();

        return $ban;
    }

    public function getBanList()
    {
        $banList = BanListHistory::orderBy('id', 'desc')->get();

        // Przechowuje wynikowe dane
        $result = [];

        foreach ($banList as $ban) {
            // Konwertowanie czasu utworzenia na czytelny dla ludzi format
            $createdAt = date("Y-m-d H:i:s", $ban->timeat);

            // Konwertowanie czasu wygaśnięcia na czytelny dla ludzi format
            $expiration = date("Y-m-d H:i:s", $ban->expiration);

            // Dodanie konwertowanych wartości do tablicy wynikowej
            $banArray = $ban->toArray();
            $banArray['created_at'] = $createdAt;
            $banArray['expiration'] = $expiration;

            $result[] = $banArray;
        }

        return $result;
    }
}
