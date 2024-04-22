<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Players;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function store(Request $request){

        
        if (!auth()->user()->can('clear-inventory')) {
            return response()->json(['error' => 'Nie masz uprawnień do usuwania postaci.']);
        }

        $identifier = $request->identifierHex;
        $data = Players::Where('identifier', $identifier)->select(['inventory'])->get()->toArray();
        $player = Players::Where('identifier', $identifier)->update(['inventory' => '[]']);

        if($player){
            return response()->json(['success'=> "Pomyślnie wyczyszczono inventory gracza", 'logData' => $data]);
        }

        return response()->json(['error'=> "Nie znaleziono gracza"]);
    }
}
