<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;

class DiscordAuthController
{
    public function redirectToDiscord()
    {
        $queryParams = [
            'client_id' => "1223046534715670669",
            'redirect_uri' => "http://45.152.161.159:80/auth/discord/callback",
            'response_type' => 'code',
            'scope' => 'identify',
        ];

        return redirect()->away('https://discord.com/api/oauth2/authorize?' . http_build_query($queryParams));
    }

    public function handleDiscordCallback(Request $request)
    {
  
        $tokenResponse = Http::asForm()->post('https://discord.com/api/oauth2/token', [
            'client_id' => "1223046534715670669",
            'client_secret' =>"otP8P-bd-I1KUO-dw2BcOYo2RbmVLLrP",
            'grant_type' => 'authorization_code',
            'code' => $request->code,
            'redirect_uri' =>"http://45.152.161.159:80/auth/discord/callback",
            'scope' => 'identify',
        ]);

        $accessToken = $tokenResponse->json('access_token');
        
        $userResponse = Http::withHeaders([
            'Authorization' => 'Bearer ' . $accessToken,
        ])->get('https://discord.com/api/users/@me');
        $discordData = $userResponse->json(); // Pobierz dane użytkownika w formacie JSON
        if (!isset($discordData['id'])) {
            // Jeśli identyfikator użytkownika nie został znaleziony w odpowiedzi Discorda, przekieruj na stronę główną z błędem 
            return redirect()->route('home')->with('error', 'Nie udało się zalogować.');
        } 

        $user = User::where('discord_id', $discordData['id'])->first();

        if (!$user) {
            // Jeśli użytkownik nie istnieje w bazie danych, przekieruj na stronę główną z informacją o braku uprawnień
            return redirect()->route('home')->with('error', 'Nie masz uprawnień.');
        }

        auth()->login($user); // Logowanie użytkownika
        return redirect()->route('index');
    }

}
