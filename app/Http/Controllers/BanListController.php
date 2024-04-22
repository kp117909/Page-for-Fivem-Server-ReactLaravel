<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BanList;
use App\Models\BanInfo;
use App\Models\BanListHistory;
use App\Models\Players;


class BanListController
{
    public function store(Request $request)
    {
        if (!auth()->user()->can('ban-player')) {
            return response()->json(['error' => 'Nie masz uprawnień do usuwania postaci.']);
        }

        $identifier = $request->identifierHex;
        $time = $request->time;
        $reason = $request->reason;
        $playerName = $request->playerName;
        $adminName = auth()->user()->name;
        $timeType = $request->timeType;
        $banData = BanInfo::where('identifier', $identifier)->first();
        $banListData = BanList::where('identifier', $identifier)->first();
        $player = Players::where('identifier', $identifier)->first();
        if ($timeType == "perm") {
            $expiration = '0'; // Jeśli typ czasu to "perm", ustawiaj na '0'
        } elseif ($timeType == "hour") {
            $expiration = strval(time() + ($time * 3600)); // Jeśli typ czasu to "hour", oblicz czas w godzinach
        } elseif ($timeType == "day") {
            $expiration = strval(time() + ($time * 3600 * 24)); // Jeśli typ czasu to "day", oblicz czas w dniach
        } else {
            $expiration = null; // Domyślnie ustaw null lub inną wartość
        }
        if ($banData) {
            if ($banListData){
                $currentBan = $banListData;
                $currentBan->expiration = $expiration;
                $currentBan->reason = $request->reason;
                $currentBan->sourceplayername = $adminName;
                $currentBan->save();

                $currentBanHistory = new BanListHistory();
                $currentBanHistory->identifier = $currentBan->identifier;
                $currentBanHistory->license = $currentBan->license;
                $currentBanHistory->liveid = $currentBan->liveid;
                $currentBanHistory->xblid = $currentBan->xblid;
                $currentBanHistory->discord = $currentBan->discord;
                $currentBanHistory->playerip = $currentBan->playerip;
                $currentBanHistory->targetplayername = $playerName;
                $currentBanHistory->sourceplayername = $adminName;
                $currentBanHistory->reason = $reason;
                $currentBanHistory->timeat = strval(time());
                $currentBanHistory->expiration = $expiration;
                $currentBanHistory->permanent = ($timeType == "perm") ? 1 : 0;
                $currentBanHistory->token = $currentBan->token;

                $currentBanHistory->save();

                $player->isBanned = true;
                return response()->json(['message' => 'Zmieniono aktualną długość bana gracza', 'type' => 'changed', 'player' =>$player, 'logData'=> $currentBanHistory], 200);
            }else{
                $newBan = new BanList([
                    'identifier' => $identifier,
                    'license' => $banData->license,
                    'liveid' => $banData->liveid,
                    'xblid' => $banData->xblid,
                    'discord' => $banData->discord,
                    'playerip' => $banData->playerip,
                    'targetplayername' => $playerName,
                    'sourceplayername' => $adminName,
                    'reason' => $reason,
                    'timeat' => strval(time()),
                    'expiration' => $expiration,
                    'permanent' => ($timeType == "perm") ? 1 : 0,
                    'token' => $banData->token
                ]);

                $newBanHistory = new BanListHistory([
                    'identifier' => $identifier,
                    'license' => $banData->license,
                    'liveid' => $banData->liveid,
                    'xblid' => $banData->xblid,
                    'discord' => $banData->discord,
                    'playerip' => $banData->playerip,
                    'targetplayername' => $playerName,
                    'sourceplayername' => $adminName,
                    'reason' => $reason,
                    'timeat' => strval(time()),
                    'expiration' => $expiration,
                    'permanent' => ($timeType == "perm") ? 1 : 0,
                    'token' => $banData->token
                ]);

                try {
                    $newBanHistory->save();
                    $newBan->save();
                    return response()->json(['message' => 'Pomyślnie zbanowano gracza', 'type' => 'banned', 'player' =>$player, 'logData'=> $newBanHistory], 200);
                } catch (\Exception $e) {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            }
        } else {

            $newBan = new BanList([
                'identifier' => $identifier,
                'targetplayername' => $playerName,
                'sourceplayername' => $adminName,
                'reason' => $reason,
                'timeat' => strval(time()),
                'expiration' => $expiration,
                'permanent' => ($timeType == "perm") ? 1 : 0,
            ]);


            $newBanHistory = new BanListHistory([
                'identifier' => $identifier,
                'targetplayername' => $playerName,
                'sourceplayername' => $adminName,
                'reason' => $reason,
                'timeat' => strval(time()),
                'expiration' => $expiration,
                'permanent' => ($timeType == "perm") ? 1 : 0,
            ]);

            // Zapisz nowy rekord w BanList
            $newBanHistory->save();
            $newBan->save();
            return response()->json(['message' => 'Pomyślnie zbanowano gracza bez danych szczegółowych', 'type' => 'bannedNoInfo', 'player' =>$player], 200);
        }
    }

    public function list()
    {
        $banList = $this->getBanList();

        return $banList;
    }

    public function get(Request $request)
    {
        $identifier = $request->identifier;
        $ban = BanList::where('identifier', $identifier)->first();

        return $ban;
    }

    public function delete(Request $request)
    {
        if (!auth()->user()->can('ban-delete')) {
            return response()->json(['error' => 'Nie masz uprawnień do usuwania postaci.']);
        }

        // Pobranie identyfikatora bana z żądania
        $identifier = $request->identifier;

        // Znalezienie bana na podstawie identyfikatora
        $banData = BanList::where('identifier', $identifier)->get()->toArray();
        $ban = BanList::where('identifier', $identifier)->first();

        // Sprawdzenie, czy ban został znaleziony
        if ($ban) {
            $ban->delete();
            return response()->json(['message' => 'Ban został pomyślnie usunięty', 'type' => 'success', 'logData' => $banData], 200);
        } else {
            return response()->json(['message' => 'Nie można znaleźć bana o podanym identyfikatorze', 'type' => "error"], 404);
        }
    }

    public function getBanList()
    {
        $banList = BanList::orderBy('id', 'desc')->get();

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


