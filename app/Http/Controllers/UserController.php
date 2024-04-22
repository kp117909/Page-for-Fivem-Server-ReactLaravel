<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{

    public function list()
    {
        $userList = User::with(['roles:name', 'permissions:name'])->get();

        return $userList;
    }

    public function get()
    {
        $discordId = Auth::user()->discord_id;

        $user = User::where('discord_id', $discordId)->first();
        $user->getAllPermissions();
        return response()->json($user);
    }

    // public function delete(Request $request)
    // {
    //     // Pobranie identyfikatora bana z żądania
    //     $identifier = $request->identifier;

    //     // Znalezienie bana na podstawie identyfikatora
    //     $ban = BanList::where('identifier', $identifier)->first();

    //     // Sprawdzenie, czy ban został znaleziony
    //     if ($ban) {
    //         $ban->delete();
    //         return response()->json(['message' => 'Ban został pomyślnie usunięty', 'type' => 'success'], 200);
    //     } else {
    //         return response()->json(['message' => 'Nie można znaleźć bana o podanym identyfikatorze', 'type' => "error"], 404);
    //     }
    // }
}
