<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Players;
use App\Models\BanList;
use App\Models\OwnedVehicles;
use App\Models\OwnedSchowek;
use App\Models\OwnedProperties;
use App\Models\UserLicenses;
use App\Models\GasStationBusiness;
use App\Models\PhoneCrypto;
use App\Models\PhonePhones;
use App\Models\PhoneBackups;
use App\Models\EmsGodziny;
use App\Models\LspdGodziny;
use Carbon\Carbon;

class PlayerController
{

    public function store(Request $request)
    {

        return response()->json([$request->all()]);
    }

    public function get($identifier)
    {
        $player = Players::Where('identifier', $identifier)->first();
        if ($player) {
            $cleanIdentifier = substr($player->identifier, strpos($player->identifier, ':') + 1);
            $cleanIdentifierWithPrefix = 'steam:' . $cleanIdentifier;

            $bannedPlayer = BanList::where('identifier', $cleanIdentifierWithPrefix)->first();

            if ($bannedPlayer) {
                // Jeśli gracz jest zbanowany, ustaw flagę isBanned na true
                $player->isBanned = true;
                // Konwertuj timestamp na czytelną datę i godzinę dla daty wygaśnięcia bana
                $player->banExpiration = Carbon::createFromTimestamp($bannedPlayer->expiration)->toDateTimeString();
            } else {
                // Jeśli gracz nie jest zbanowany, ustaw flagę isBanned na false i datę wygaśnięcia na null
                $player->isBanned = false;
                $player->banExpiration = null;
            }

            return $player;
        } else {
            // Jeśli nie znaleziono gracza o podanym identyfikatorze, zwróć pustą odpowiedź lub odpowiedni komunikat błędu
            return response()->json(['error' => 'Gracz o podanym identyfikatorze nie istnieje [PlayerController]'], 404);
        }
    }


    public function list()
    {
        $players = Players::all();

        // Pobierz identyfikatory graczy, którzy są zbanowani i daty wygaśnięcia banów
        $bannedPlayers = BanList::select('identifier', 'expiration')->get();
        // Dodaj informacje o banie i dacie wygaśnięcia do danych o graczach
        foreach ($players as $player) {
            $cleanIdentifier = substr($player->identifier, strpos($player->identifier, ':') + 1);
            $cleanIdentifierWithPrefix = 'steam:' . $cleanIdentifier;

            $player->isBanned = $bannedPlayers->contains('identifier', $cleanIdentifierWithPrefix);

            if ($player->isBanned) {
                // Znajdź datę wygaśnięcia bana dla danego gracza
                $ban = $bannedPlayers->firstWhere('identifier', $cleanIdentifierWithPrefix);
                // Konwertuj timestamp na czytelną datę i godzinę
                $player->banExpiration = Carbon::createFromTimestamp($ban->expiration)->toDateTimeString();
            } else {
                $player->banExpiration = null; // Gracz nie jest zbanowany, więc brak daty wygaśnięcia
            }
        }

        return $players;
    }

    public function getDeleteCharacter($identifier)
    {

        if (!auth()->user()->can('character-delete')) {
            return response()->json(['error' => 'Nie masz uprawnień do usuwania postaci.']);
        }
        
        // PLAYER
        $player = Players::Where('identifier', $identifier)->first();

        $playerData = Players::Where('identifier', $identifier)->select('identifier', 'accounts', 'job', 'job2', 'job3', 'job_grade', 'job2_grade', 'job3_grade', 'inventory', 'firstname', 'lastname', 'kursy', 'time')->get()->toArray();
        if ($player){
            $ownedVehicles = OwnedVehicles::where('owner', $identifier)
            ->select(['owner', 'plate', 'shared', 'model', 'price', 'glovebox', 'trunk', 'isdonator'])
            ->get()
            ->toArray();
        
        if (empty($ownedVehicles)) {
            $ownedVehicles = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $ownedProperties = OwnedProperties::where('owner', $identifier)->get()->toArray();
        if (empty($ownedProperties)) {
            $ownedProperties = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $userLicenses = UserLicenses::where('owner', $identifier)->get()->toArray();
        if (empty($userLicenses)) {
            $userLicenses = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $gasStationBusinesses = GasStationBusiness::where('user_id', $identifier)->get()->toArray();
        if (empty($gasStationBusinesses)) {
            $gasStationBusinesses = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $phoneCrypto = PhoneCrypto::where('identifier', $identifier)->get()->toArray();
        if (empty($phoneCrypto)) {
            $phoneCrypto = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $phonePhones = PhonePhones::where('id', $identifier)->get()->toArray();
        if (empty($phonePhones)) {
            $phonePhones = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $phoneBackups = PhoneBackups::where('identifier', $identifier)->get()->toArray();
        if (empty($phoneBackups)) {
            $phoneBackups = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $emsGodziny = EmsGodziny::where('identifier', $identifier)->get()->toArray();
        if (empty($emsGodziny)) {
            $emsGodziny = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $lspdGodziny = LspdGodziny::where('identifier', $identifier)->get()->toArray();
        if (empty($lspdGodziny)) {
            $lspdGodziny = [['message' => 'Brak danych do wyczyszczenia']];
        }
        
        $ownedSchowek = OwnedSchowek::where('special_id', $player->special_id)->get()->toArray();
        if (empty($ownedSchowek)) {
            $ownedSchowek = [['message' => 'Brak danych do wyczyszczenia']];
        }

            // VEHICLES 
            OwnedVehicles::where('owner', $identifier)->delete();
            OwnedVehicles::where('shared', $identifier)->update(['shared' => null]);
            
            // HOUSE
            OwnedSchowek::where('special_id', $player->special_id)->delete();
            OwnedProperties::where('owner', $identifier)->delete();
            OwnedProperties::where('shared', $identifier)->update(['shared' => null]);
            // LICENSES
            UserLicenses::where('owner', $identifier)->delete();
            // GAS STATION
            GasStationBusiness::where('user_id', $identifier)->delete();
            GasStationBusiness::where('couser_id', $identifier)->update(['couser_id' => null]);
            // PHONE
            PhoneCrypto::where('identifier', $identifier)->delete();
            PhonePhones::where('id', $identifier)->delete();
            PhoneBackups::where('identifier', $identifier)->delete();
            //EMS GODZINY
            EmsGodziny::where('identifier', $identifier)->delete();
            LspdGodziny::where('identifier', $identifier)->delete();
            // DELETE PLAYER 
            Players::Where('identifier', $identifier)->delete();

            $allData = [
                'ownedVehicles' => $ownedVehicles, // work
                'ownedProperties' => $ownedProperties, // work
                'userLicenses' => $userLicenses,  //work
                'gasStationBusinesses' => $gasStationBusinesses, // work
                'phoneCrypto' => $phoneCrypto, // work
                'phonePhones' => $phonePhones, // work
                'phoneBackups' => $phoneBackups, // work
                'emsGodziny' => $emsGodziny, // work
                'lspdGodziny' => $lspdGodziny, // work
                'ownedSchowek' => $ownedSchowek, // work
                'playerData' => $playerData, // work
            ];
            
            return response()->json(['msg' => "Postać usunięta", 'logData' => $allData]);
        }else{
            return response("Nie znaleziono postaci");
        }

    }


}
