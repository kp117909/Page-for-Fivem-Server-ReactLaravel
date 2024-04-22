<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OwnedVehicles;

class VehicleController extends Controller
{
    
    public function getPlayerVehicles($identifier)
    {
        $vehicles = OwnedVehicles::where('owner', $identifier)->get();
        return $vehicles;
    }

    public function getDeleteVehicle($plate)
    {
        if (!auth()->user()->can('vehicle-delete')) {
            return response()->json(['error' => 'Nie masz uprawnień do usuwania samochodów.']);
        }

        $vehicleData = OwnedVehicles::where('plate', $plate)->get()->toArray();
        $vehicle = OwnedVehicles::where('plate', $plate)->delete();

        return response()->json(["message"=> "Samochód usunięty", "logData" =>$vehicleData]);

    }
    
    public function store(Request $request){

        if (!auth()->user()->can('vehicle-store')) {
            return response()->json(['error' => 'Nie masz uprawnień do usuwania samochodów.']);
        }
        
        $identifier = $request->identifier;
        $model = $request->model;
        $plate = $request->plate;
        $isdonator = $request->isdonator;
        $foundVehicle = OwnedVehicles::where('plate', $plate)->first();

        if ($foundVehicle) {
            return response()->json(['type' => false, 'message' => "Samochód o takiej rejestracji już istnieje!"]);
        }

        $newVehicle = new OwnedVehicles([
            'owner' => $identifier,
            'plate' => $plate,
            'model' => $model,
            'price' => 1000000,
            'isdonator' => $isdonator,
        ]);

        $newVehicle->save();
        return response()->json(['type' => true, 'message' => "Samochód został dodany!"]);
        
    }

}
